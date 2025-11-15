'use client'

// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
// utils
// vendors
import { Formik } from 'formik'
// types
import type {
    DataTableProps,
    GetRowDataType,
    MutateType,
} from '@/components/data-table'
// components
import Datatable, { getNoWrapCellProps } from '@/components/data-table'
import type BusinessUnit from '@/enums/business-unit'
import axios from '@/lib/axios'
import formatNumber from '@/utils/format-number'
import getInstallmentColor from '@/utils/get-installment-color'
// utils
import handle422 from '@/utils/handle-422'
import shortUuid from '@/utils/short-uuid'
import Dialog from '../Global/Dialog'
import StateFilterChips from './components/state-filter-chips'
import TypeFilterChips from './components/type-filter-chips'
// locals
import { useHooks } from './hooks/use-hooks'
import ReceivablePaymentForm from './payment-form'
import type ApiResponseItem from './types/api-response-item'

const DATATABLE_ENDPOINT_URL = 'receivables/datatable-data'

let getRowData: GetRowDataType<ApiResponseItem> = () => undefined
let mutate: MutateType<ApiResponseItem>

export default function ReceivablesDatatable({
    asManager = false,
    type: typeProp,
}: {
    asManager?: boolean
    type?:
        | 'rent-item-rent'
        | 'product-sale'
        | 'user-loan'
        | BusinessUnit.BENGKEL
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
                    asManager: asManager ? 'true' : '',
                    state: state as string | undefined,
                    type: typeProp ?? (type as string | undefined),
                }}
                columns={
                    asManager
                        ? DATATABLE_COLUMNS
                        : DATATABLE_COLUMNS.filter(
                              c => c.label !== 'Nama Pengguna',
                          )
                }
                defaultSortOrder={{
                    direction: 'asc',
                    name: 'should_be_paid_at',
                }}
                download={true}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        return setFormikProps({
                            status: data,
                            values: {
                                adjustment_rp: data.transaction?.amount
                                    ? data.transaction?.amount - data.amount_rp
                                    : undefined,
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
                            },
                        })
                    }
                }}
                tableId="receiveables-table"
                title={asManager ? 'Daftar Piutang' : 'Daftar Tagihan'}
            />

            <Dialog
                maxWidth="xs"
                open={Boolean(formikProps)}
                title="Pelunasan Angsuran">
                {formikProps?.values && formikProps?.status && (
                    <Formik
                        component={ReceivablePaymentForm}
                        initialStatus={formikProps.status}
                        initialValues={formikProps.values}
                        onReset={closeFormDialog}
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
                    />
                )}
            </Dialog>
        </Box>
    )
}

const DATATABLE_COLUMNS: DataTableProps<ApiResponseItem>['columns'] = [
    {
        label: 'Kode',
        name: 'uuid',
        options: {
            customBodyRender: value => shortUuid(value),
        },
    },

    // User ID
    {
        label: 'ID Pengguna',
        name: 'user_id',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
            sort: false,
        },
    },

    // User Name
    {
        label: 'Nama Pengguna',
        name: 'user_name',
        options: {
            sort: false,
        },
    },

    {
        label: 'Peran',
        name: 'user_roles',
        options: {
            display: false,
            sort: false,
        },
    },

    // Transaction Date
    {
        label: 'TGL. Transaksi',
        name: 'at',
        options: {
            searchable: false,
            setCellProps: getNoWrapCellProps,
            sort: false,
        },
    },

    // Installmentable UUID (short)
    {
        label: 'Kode Referensi',
        name: 'installmentable_uuid',
        options: {
            customBodyRender: value => shortUuid(value),
            sort: false,
        },
    },

    // Installmentable Classname (Type)
    {
        label: 'Jenis',
        name: 'installmentable_classname',
        options: {
            customBodyRender: getInstallmentTypeByClassname,
            searchable: false,
            sort: false,
        },
    },

    // Amount
    {
        label: 'Nilai (Rp)',
        name: 'amount_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
            searchable: false,
            setCellProps: getNoWrapCellProps,
        },
    },

    // Due Date
    {
        label: 'Jatuh Tempo',
        name: 'should_be_paid_at',
        options: {
            setCellProps: getNoWrapCellProps,
        },
    },

    // Current State
    {
        label: 'Status',
        name: 'state',
        options: {
            customBodyRender: value => value, // for download purpose
            customBodyRenderLite: dataIndex => {
                const installment = getRowData(dataIndex)

                if (installment)
                    return (
                        <Box color={getInstallmentColor(installment)}>
                            {installment.state}
                            {installment?.transaction?.at && (
                                <Typography
                                    component="div"
                                    fontSize="0.7rem"
                                    variant="caption">
                                    TGL:{' '}
                                    {dayjs(installment.transaction.at).format(
                                        'DD-MM-YYYY',
                                    )}
                                </Typography>
                            )}
                        </Box>
                    )
            },
            searchable: false,
            sort: false,
        },
    },
]

function getInstallmentTypeByClassname(classname: string) {
    switch (classname) {
        case 'App\\Models\\ProductSale':
            return 'Penjualan Produk (SAPRODI)'

        case 'App\\Models\\UserLoan':
            return 'Pinjaman (SPP)'

        case 'App\\Models\\RentItemRent':
            return 'Sewa Alat Berat'

        case 'Modules\\RepairShop\\Models\\Sale':
            return 'Belayan Spare Parts'
    }
}
