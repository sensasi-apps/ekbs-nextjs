'use client'

// types
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
} from '@/components/Datatable'
import dayjs from 'dayjs'
// utils
// vendors
import { Formik } from 'formik'
import axios from '@/lib/axios'
import shortUuid from '@/utils/short-uuid'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// components
import Datatable from '@/components/Datatable'
import Dialog from '../Global/Dialog'
// locals
import { useHooks } from './hooks/useHooks'
import { DATATABE_SEARCH_ONLY_COLUMNS } from './hooks/statics'
import StateFilterChips from './components/state-filter-chips'
import TypeFilterChips from './components/type-filter-chips'
// utils
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import handle422 from '@/utils/handle-422'
import ReceivablePaymentForm from './PaymentForm'
import formatNumber from '@/utils/format-number'
import getInstallmentColor from '@/utils/get-installment-color'

const DATATABLE_ENDPOINT_URL = 'receivables/datatable-data'

let getRowData: GetRowDataType<InstallmentORM> = () => undefined
let mutate: MutateType<InstallmentORM>

export default function ReceivablesDatatable({
    asManager = false,
    type: typeProp,
}: {
    asManager?: boolean
    type?: 'rent-item-rent' | 'product-sale' | 'user-loan'
}) {
    const { type, state, formikProps, closeFormDialog, setFormikProps } =
        useHooks()

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {!typeProp && <TypeFilterChips />}

            <StateFilterChips />

            <Datatable
                apiUrl={DATATABLE_ENDPOINT_URL}
                apiUrlParams={{
                    type: typeProp ?? (type as string | undefined),
                    state: state as string | undefined,
                    asManager: asManager ? 'true' : '',
                }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                columns={
                    asManager
                        ? DATATABLE_COLUMNS
                        : DATATABLE_COLUMNS.filter(
                              c => c.label !== 'Nama Pengguna',
                          )
                }
                defaultSortOrder={{
                    name: 'should_be_paid_at',
                    direction: 'asc',
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        return setFormikProps({
                            values: {
                                at: data.transaction?.at,
                                cashable_uuid: data.transaction?.cashable_uuid,
                                payment_method:
                                    data.transaction?.cashable_classname ===
                                    'App\\Models\\Cash'
                                        ? 'cash'
                                        : data.transaction
                                                ?.cashable_classname ===
                                            'App\\Models\\UserCash'
                                          ? 'wallet'
                                          : undefined,
                                adjustment_rp: data.transaction?.amount
                                    ? data.transaction?.amount - data.amount_rp
                                    : undefined,
                            },
                            status: data,
                        })
                    }
                }}
                tableId="receiveables-table"
                title={asManager ? 'Daftar Piutang' : 'Daftar Tagihan'}
                download={true}
            />

            <Dialog
                title="Pelunasan Angsuran"
                open={Boolean(formikProps)}
                maxWidth="xs">
                {formikProps?.values && formikProps?.status && (
                    <Formik
                        initialValues={formikProps.values}
                        initialStatus={formikProps.status}
                        onSubmit={(values, { setErrors }) =>
                            axios
                                .put(
                                    `receivables/payment/${formikProps.status.uuid}`,
                                    values,
                                )
                                .then(() => {
                                    mutate?.()
                                    closeFormDialog()
                                })
                                .catch(error => handle422(error, setErrors))
                        }
                        onReset={closeFormDialog}
                        component={ReceivablePaymentForm}
                    />
                )}
            </Dialog>
        </Box>
    )
}

const DATATABLE_COLUMNS: DatatableProps<InstallmentORM>['columns'] = [
    {
        name: 'uuid',
        label: 'Kode',
        options: {
            customBodyRender: value => shortUuid(value),
        },
    },

    // User ID
    {
        name: 'user_id',
        label: 'ID Pengguna',
        options: {
            searchable: false, // search is accommodated in DATATABE_SEARCH_ONLY_COLUMNS
            sort: false,
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
        },
    },

    // User Name
    {
        name: 'user_name',
        label: 'Nama Pengguna',
        options: {
            searchable: false,
            sort: false,
        },
    },

    // Transaction Date
    {
        name: 'at',
        label: 'TGL. Transaksi',
        options: {
            searchable: false,
            sort: false,
        },
    },

    // Installmentable UUID (short)
    {
        name: 'installmentable_uuid',
        label: 'Kode Referensi',
        options: {
            sort: false,
            customBodyRender: value => shortUuid(value),
        },
    },

    // Installmentable Classname (Type)
    {
        name: 'installmentable_classname',
        label: 'Jenis',
        options: {
            sort: false,
            searchable: false,
            customBodyRender: getInstallmentTypeByClassname,
        },
    },

    // Amount
    {
        name: 'amount_rp',
        label: 'Nilai (Rp)',
        options: {
            searchable: false,
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: number) => formatNumber(value),
        },
    },

    // Due Date
    {
        name: 'should_be_paid_at',
        label: 'Jatuh Tempo',
    },

    // Current State
    {
        name: 'state',
        label: 'Status',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: value => value, // for download purpose
            customBodyRenderLite: dataIndex => {
                const installment = getRowData(dataIndex)

                if (installment)
                    return (
                        <Box color={getInstallmentColor(installment)}>
                            {installment.state}
                            {installment?.transaction?.at && (
                                <Typography
                                    variant="caption"
                                    fontSize="0.7rem"
                                    component="div">
                                    TGL:{' '}
                                    {dayjs(installment.transaction.at).format(
                                        'DD-MM-YYYY',
                                    )}
                                </Typography>
                            )}
                        </Box>
                    )
            },
        },
    },

    ...DATATABE_SEARCH_ONLY_COLUMNS,
]

function getInstallmentTypeByClassname(classname: string) {
    switch (classname) {
        case 'App\\Models\\ProductSale':
            return 'Penjualan Produk (SAPRODI)'

        case 'App\\Models\\UserLoan':
            return 'Pinjaman (SPP)'

        case 'App\\Models\\RentItemRent':
            return 'Sewa Alat Berat'
    }
}
