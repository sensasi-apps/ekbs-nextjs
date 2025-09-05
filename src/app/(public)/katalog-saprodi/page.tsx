'use client'
// types
import type { DatatableProps, GetRowDataType } from '@/components/Datatable'
import type ProductType from '@/modules/farm-inputs/types/orms/product'
// vendors
import { useSearchParams } from 'next/navigation'
import Head from 'next/head'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import Datatable from '@/components/Datatable'
import FarmInputsProductsLowQty from '@/components/pages/farm-inputs/products/LowQty'
import WarehouseSelectionButton from '@/app/(public)/katalog-saprodi/_parts/warehouse-selection-button'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import formatNumber from '@/utils/format-number'

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
                <Typography variant="h4" component="h1">
                    {pageTitle}
                </Typography>

                <Typography variant="subtitle1" component="h2">
                    Koperasi Belayan Sejahtera
                </Typography>

                <WarehouseSelectionButton />
            </Box>

            <Datatable<DataType>
                apiUrl={'/public/produk-saprodi/datatable/' + warehouse}
                columns={columns}
                defaultSortOrder={{
                    name: 'category_name',
                    direction: 'asc',
                }}
                tableId="products-table"
                title={'Daftar Produk — Gudang ' + warehouse.toUpperCase()}
                getRowDataCallback={fn => (getRowData = fn)}
                swrOptions={{
                    revalidateOnMount: true,
                }}
            />
            <Box mt={1}>
                <Typography variant="caption">Keterangan:</Typography>
                <Box component="ul" m={0}>
                    <Typography variant="caption" component="li">
                        Stok berwarna{' '}
                        <Typography
                            variant="caption"
                            color="warning.main"
                            component="span">
                            kuning
                        </Typography>{' '}
                        menandakan persediaan telah menipis.
                    </Typography>

                    <Typography variant="caption" component="li">
                        Stok berwarna{' '}
                        <Typography
                            variant="caption"
                            color="error.main"
                            component="span">
                            merah
                        </Typography>{' '}
                        menandakan persediaan telah habis.
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

const columns: DatatableProps<DataType>['columns'] = [
    {
        name: 'category_name',
        label: 'Kategori',
        options: {
            customBodyRender: (text: string) => (
                <Chip label={text} size="small" variant="outlined" />
            ),
        },
    },
    {
        name: 'id',
        label: 'ID',
        options: {
            display: 'excluded',
        },
    },
    {
        name: 'code',
        label: 'Kode',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return

                const { id, code } = data

                return (
                    <Typography
                        variant="overline"
                        fontFamily="monospace"
                        lineHeight="inherit">
                        {code ?? id}
                    </Typography>
                )
            },
        },
    },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'description',
        label: 'Deskripsi',
        options: {
            display: false,
        },
    },
    {
        name: 'qty',
        label: 'Stok',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return

                const { qty, low_number, unit } = data

                const isLowQty = low_number !== null && qty <= low_number

                const base = (
                    <Box
                        component="span"
                        lineHeight="inherit"
                        whiteSpace="nowrap"
                        color={qty === 0 ? 'error.main' : undefined}>
                        {formatNumber(qty)}{' '}
                        <Typography
                            variant="overline"
                            fontFamily="monospace"
                            lineHeight="inherit">
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
        name: 'default_sell_price',
        label: 'Harga Satuan (Tunai)',
        options: {
            customBodyRender: value => (
                <>{value ? numberToCurrency(value) : ''}</>
            ),
        },
    },
    {
        name: 'default_sell_price',
        label: 'Harga Satuan (Potong 1x)',
        options: {
            sort: false,
            searchable: false,
            customBodyRender: value =>
                value
                    ? numberToCurrency(Math.ceil(value + (value * 4) / 100))
                    : '',
        },
    },
    {
        name: 'default_sell_price',
        label: 'Harga Satuan (Potong 2x)',
        options: {
            sort: false,
            searchable: false,
            customBodyRender: value =>
                value
                    ? numberToCurrency(Math.ceil(value + (value * 8) / 100))
                    : '',
        },
    },
]
