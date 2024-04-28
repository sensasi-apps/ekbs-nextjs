// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type Installment from '@/dataTypes/Installment'
// vendors
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Chip, { ChipOwnProps } from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import Datatable, { GetRowDataType, MutateType } from '@/components/Datatable'
import ScrollableXBox from '../ScrollableXBox'
// utils
import getInstallmentType from '@/utils/getInstallmentType'
import getInstallmentColor from '@/utils/getInstallmentColor'
import handle422 from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'
import ReceivablePaymentForm, { FormValuesType } from './PaymentForm'
import Dialog from '../Global/Dialog'

const DATATABLE_ENDPOINT_URL = 'receivables/datatable-data'

let getRowData: GetRowDataType<Installment>
let mutate: MutateType

export default function ReceivablesDatatable({
    asManager,
    type: typeProp,
}: {
    asManager?: boolean
    type?: 'rent-item-rent' | 'product-sale' | 'user-loan'
}) {
    const {
        query: { type, state },
    } = useRouter()

    const [formikProps, setFormikProps] = useState<{
        values: FormValuesType
        status: Installment
    }>()

    const closeFormDialog = () => setFormikProps(undefined)

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {!typeProp && <TypeFilterChips />}

            <StateFilterChips />

            <Datatable
                apiUrl={DATATABLE_ENDPOINT_URL}
                apiUrlParams={{
                    type: typeProp ?? (type as string | undefined),
                    state: state as string | undefined,
                    asManager: asManager as string | undefined,
                }}
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
                onRowClick={
                    true // TODO: remove this after data is ready
                        ? undefined
                        : (_, { dataIndex }, event) => {
                              if (event.detail === 2) {
                                  const data = getRowData(dataIndex)
                                  if (!data) return

                                  return setFormikProps({
                                      values: {
                                          at: data.transaction?.at,
                                          cashable_uuid:
                                              data.transaction?.cashable_uuid,
                                          payment_method:
                                              data.transaction
                                                  ?.cashable_classname ===
                                              'App\\Models\\Cash'
                                                  ? 'cash'
                                                  : data.transaction
                                                          ?.cashable_classname ===
                                                      'App\\Models\\UserCash'
                                                    ? 'wallet'
                                                    : undefined,
                                          adjustment_rp: data.transaction
                                              ?.amount
                                              ? data.transaction?.amount -
                                                data.amount_rp
                                              : undefined,
                                      },
                                      status: data,
                                  })
                              }
                          }
                }
                tableId="receiveables-table"
                title={asManager ? 'Daftar Piutang' : 'Daftar Tagihan'}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
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
                                    mutate()
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

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
            filter: false,
            sort: false,
        },
    },
    {
        name: 'should_be_paid_at',
        label: 'Jatuh Tempo',
        options: {
            customBodyRender: value => (value ? toDmy(value) : ''),
        },
    },
    {
        name: 'installmentable',
        label: 'Nama Pengguna',
        options: {
            searchable: false,
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return null

                return (
                    data.user_loan?.user?.name ??
                    data.product_sale?.buyer_user?.name ??
                    data.rent_item_rent?.by_user?.name
                )
            },
        },
    },
    {
        name: 'installmentable_uuid',
        label: 'Tipe',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const installment = getRowData(dataIndex)

                if (installment) return getInstallmentType(installment)
            },
        },
    },

    {
        name: 'amount_rp',
        label: 'Nilai',
        options: {
            searchable: false,
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },

    {
        name: 'state',
        label: 'Status',
        options: {
            searchable: false,
            sort: false,
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

    // [...COLUMNS_FOR_SEARCH_ONLY],
    {
        name: 'productSale.buyerUser.name',
        options: {
            display: 'excluded',
            filter: false,
            sort: false,
        },
    },
    {
        name: 'userLoan.user.name',
        options: {
            display: 'excluded',
            filter: false,
            sort: false,
        },
    },
    {
        name: 'rentItemRent.byUser.name',
        options: {
            display: 'excluded',
            filter: false,
            sort: false,
        },
    },
]

const CHIP_DEFAULT_PROPS: ChipOwnProps = {
    size: 'small',
}

function TypeFilterChips() {
    const { replace, query } = useRouter()

    function handleTypeChange(value?: string) {
        replace({
            query: {
                ...query,
                type: value,
            },
        })
    }

    return (
        <ScrollableXBox>
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Semua"
                onClick={() => handleTypeChange(undefined)}
                color={query.type ? undefined : 'success'}
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Penjualan Produk (SAPRODI)"
                onClick={() => handleTypeChange('product-sale')}
                color={query.type === 'product-sale' ? 'success' : undefined}
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Pinjaman (SPP)"
                onClick={() => handleTypeChange('user-loan')}
                color={query.type === 'user-loan' ? 'success' : undefined}
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Sewa Alat Berat"
                onClick={() => handleTypeChange('rent-item-rent')}
                color={query.type === 'rent-item-rent' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}

function StateFilterChips() {
    const { replace, query, isReady } = useRouter()

    function handleStateChange(value?: string) {
        replace({
            query: {
                ...query,
                state: value,
            },
        })
    }

    useEffect(() => {
        if (isReady && !query.state) {
            handleStateChange('due')
        }
    }, [])

    return (
        <ScrollableXBox>
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Semua"
                onClick={() => handleStateChange(undefined)}
                color={query.state ? undefined : 'success'}
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Dekat Jatuh Tempo"
                onClick={() => handleStateChange('due-soon')}
                color={query.state === 'due-soon' ? 'success' : undefined}
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Jatuh Tempo"
                onClick={() => handleStateChange('due')}
                color={query.state === 'due' ? 'success' : undefined}
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Lunas"
                onClick={() => handleStateChange('paid')}
                color={query.state === 'paid' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}
