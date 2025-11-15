'use client'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
// vendors
import { useSearchParams } from 'next/navigation'
import WarehouseSelectionButton from '@/app/(public)/katalog-saprodi/_parts/warehouse-selection-button'
// types
import type { DataTableProps, GetRowDataType } from '@/components/data-table'
// components
import Datatable from '@/components/data-table'
import FarmInputsProductsLowQty from '@/components/pages/farm-inputs/products/LowQty'
import type ProductType from '@/modules/farm-inputs/types/orms/product'
import formatNumber from '@/utils/format-number'
// utils
import numberToCurrency from '@/utils/number-to-currency'

interface DataType extends Omit<ProductType, 'warehouses'> {
    qty: number
    default_sell_price: number
}

let getRowData: GetRowDataType<DataType>

export default function Page() {
    const pageTitle = 'Katalog Digital Produk SAPRODI'

    const searchParams = useSearchParams()
    const warehouse = searchParams?.get('warehouse') ?? 'muai'

    return (
        <>
            <Head>
                <title>
                    {pageTitle} — {process.env.NEXT_PUBLIC_APP_NAME}
                </title>
            </Head>

            <Box mb={2}>
                <Typography component="h1" variant="h4">
                    {pageTitle}
                </Typography>

                <Typography component="h2" variant="subtitle1">
                    Koperasi Belayan Sejahtera
                </Typography>

                <WarehouseSelectionButton />
            </Box>

            <Datatable<DataType>
                apiUrl={'/public/produk-saprodi/datatable/' + warehouse}
                columns={columns}
                defaultSortOrder={{
                    direction: 'asc',
                    name: 'category_name',
                }}
                getRowDataCallback={fn => (getRowData = fn)}
                swrOptions={{
                    revalidateOnMount: true,
                }}
                tableId="products-table"
                title={'Daftar Produk — Gudang ' + warehouse.toUpperCase()}
            />
            <Box mt={1}>
                <Typography variant="caption">Keterangan:</Typography>
                <Box component="ul" m={0}>
                    <Typography component="li" variant="caption">
                        Stok berwarna{' '}
                        <Typography
                            color="warning.main"
                            component="span"
                            variant="caption">
                            kuning
                        </Typography>{' '}
                        menandakan persediaan telah menipis.
                    </Typography>

                    <Typography component="li" variant="caption">
                        Stok berwarna{' '}
                        <Typography
                            color="error.main"
                            component="span"
                            variant="caption">
                            merah
                        </Typography>{' '}
                        menandakan persediaan telah habis.
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

const columns: DataTableProps<DataType>['columns'] = [
    {
        label: 'Kategori',
        name: 'category_name',
        options: {
            customBodyRender: (text: string) => (
                <Chip label={text} size="small" variant="outlined" />
            ),
        },
    },
    {
        label: 'ID',
        name: 'id',
        options: {
            display: 'excluded',
        },
    },
    {
        label: 'Kode',
        name: 'code',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return

                const { id, code } = data

                return (
                    <Typography
                        fontFamily="monospace"
                        lineHeight="inherit"
                        variant="overline">
                        {code ?? id}
                    </Typography>
                )
            },
        },
    },
    {
        label: 'Nama',
        name: 'name',
    },
    {
        label: 'Deskripsi',
        name: 'description',
        options: {
            display: false,
        },
    },
    {
        label: 'Stok',
        name: 'qty',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return

                const { qty, low_number, unit } = data

                const isLowQty = low_number !== null && qty <= low_number

                const base = (
                    <Box
                        color={qty === 0 ? 'error.main' : undefined}
                        component="span"
                        lineHeight="inherit"
                        whiteSpace="nowrap">
                        {formatNumber(qty)}{' '}
                        <Typography
                            fontFamily="monospace"
                            lineHeight="inherit"
                            variant="overline">
                            {unit}
                        </Typography>
                    </Box>
                )

                if (isLowQty)
                    return (
                        <FarmInputsProductsLowQty>
                            {base}
                        </FarmInputsProductsLowQty>
                    )

                return base
            },
        },
    },
    {
        label: 'Harga Satuan (Tunai)',
        name: 'default_sell_price',
        options: {
            customBodyRender: value => (
                <>{value ? numberToCurrency(value) : ''}</>
            ),
        },
    },
    {
        label: 'Harga Satuan (Potong 1x)',
        name: 'default_sell_price',
        options: {
            customBodyRender: value =>
                value
                    ? numberToCurrency(Math.ceil(value + (value * 4) / 100))
                    : '',
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Harga Satuan (Potong 2x)',
        name: 'default_sell_price',
        options: {
            customBodyRender: value =>
                value
                    ? numberToCurrency(Math.ceil(value + (value * 8) / 100))
                    : '',
            searchable: false,
            sort: false,
        },
    },
]
