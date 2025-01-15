// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type { GetRowDataType } from '@/components/Datatable'
import type ProductType from '@/dataTypes/Product'
// vendors
import { useRouter } from 'next/router'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import Datatable from '@/components/Datatable'
import FarmInputsProductsLowQty from '../components/pages/farm-inputs/products/LowQty'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'
// layout
import PublicLayout from '@/components/Layouts/PublicLayout'
import WarehouseSelectionButton from '@/components/pages/katalog-saprodi/WarehouseSelectionButton'

let getRowData: GetRowDataType<
    Omit<ProductType, 'warehouses'> & {
        qty: number
        default_sell_price: number
    }
>

export default function KatalogProdukSaprodi() {
    const pageTitle = 'Katalog Digital Produk SAPRODI'

    const { query } = useRouter()
    const warehouse = query.warehouse?.toString() ?? 'muai'

    return (
        <PublicLayout
            title={`${pageTitle} — ${process.env.NEXT_PUBLIC_APP_NAME}`}>
            <Box mb={2}>
                <Typography variant="h4" component="h1">
                    {pageTitle}
                </Typography>

                <Typography variant="subtitle1" component="h2">
                    Koperasi Belayan Sejahtera
                </Typography>

                <WarehouseSelectionButton />
            </Box>

            <Datatable
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
        </PublicLayout>
    )
}

const columns: MUIDataTableColumn[] = [
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
            customBodyRender: (value: number) =>
                value ? numberToCurrency(value) : '',
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
