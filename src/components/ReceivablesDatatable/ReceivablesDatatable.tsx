// types
import type { MUIDataTableColumn } from 'mui-datatables'
// vendors
import { useEffect } from 'react'
import { useRouter } from 'next/router'
// materials
import Box from '@mui/material/Box'
import Chip, { ChipOwnProps } from '@mui/material/Chip'
// components
import Datatable, { GetRowDataType } from '@/components/Datatable'
import InstallmentType from '@/dataTypes/Installment'
import ScrollableXBox from '../ScrollableXBox'
import numberToCurrency from '@/utils/numberToCurrency'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import toDmy from '@/utils/toDmy'

const DATATABLE_ENDPOINT_URL = 'receivables/datatable-data'

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
                // onRowClick={(_, { dataIndex }, event) => {
                //     if (event.detail === 2) {
                //         const data = getRowData(dataIndex)
                //         if (!data) return

                //         return handleEdit(data)
                //     }
                // }}
                tableId="receiveables-table"
                title={asManager ? 'Daftar Piutang' : 'Daftar Tagihan'}
                getRowDataCallback={fn => (getRowData = fn)}
                // mutateCallback={fn => (mutate = fn)}
            />
        </Box>
    )
}

let getRowData: GetRowDataType<InstallmentType>

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
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

                return getUserNameFromInstallmentable(data)
            },
        },
    },
    {
        name: 'installmentable_uuid',
        label: 'Tipe',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const { installmentable_uuid, installmentable_classname } =
                    getRowData(dataIndex) ?? {}

                let theReturn: string = ''

                switch (installmentable_classname) {
                    case 'App\\Models\\ProductSale':
                        theReturn = 'Penjualan Produk (SAPRODI)'
                        break

                    case 'App\\Models\\UserLoan':
                        theReturn = 'Pinjaman (SPP)'
                        break

                    case 'App\\Models\\RentItemRent':
                        theReturn = 'Sewa Alat Berat'
                        break
                }

                return (
                    <>
                        {theReturn}
                        <Typography
                            variant="caption"
                            fontSize="0.7rem"
                            component="div">
                            {installmentable_uuid?.slice(-6).toUpperCase()}
                        </Typography>
                    </>
                )
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
                const { state, transaction } = getRowData(dataIndex) ?? {}

                let color = 'inherit'

                switch (state) {
                    case 'Jatuh Tempo':
                        color = 'error.main'
                        break

                    case 'Jatuh Tempo Dalam 7 Hari':
                        color = 'warning.main'
                        break

                    case 'Lunas':
                        color = 'success.main'
                        break

                    default:
                        break
                }

                return (
                    <Box color={color}>
                        {state}
                        {transaction?.at && (
                            <Typography
                                variant="caption"
                                fontSize="0.7rem"
                                component="div">
                                TGL:{' '}
                                {dayjs(transaction.at).format('DD-MM-YYYY')}
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

const getUserNameFromInstallmentable = (data: InstallmentType) => {
    switch (data.installmentable_classname) {
        case 'App\\Models\\ProductSale':
            return data.product_sale?.buyer_user?.name

        case 'App\\Models\\UserLoan':
            return data.user_loan?.user?.name

        case 'App\\Models\\RentItemRent':
            return data.rent_item_rent?.by_user?.name

        default:
            break
    }
}

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
