// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type ProductType from '@/dataTypes/Product'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, { GetRowDataType, MutateType } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import Fab from '@/components/Fab'
import ProductForm from '@/components/Product/Form'
// page components
import FarmInputsProductsLowQty from '@/components/pages/farm-inputs/products/LowQty'
// providers
import useAuth from '@/providers/Auth'
import useFormData, { FormDataProvider } from '@/providers/useFormData'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'
import DatatableEndpointEnum from '@/types/farm-inputs/DatatableEndpointEnum'

let mutate: MutateType<ProductType>
let getRowData: GetRowDataType<ProductType>

export default function FarmInputsProducts() {
    return (
        <AuthLayout title="Produk">
            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

const Crud = () => {
    const { userHasPermission } = useAuth()

    const {
        formOpen,
        handleClose,
        handleCreate,
        handleEdit,
        isNew,
        isDirty,
        loading,
    } = useFormData<ProductType>()

    return (
        <>
            <Datatable
                apiUrl={DatatableEndpointEnum.PRODUCTS}
                columns={columns}
                defaultSortOrder={{ name: 'name', direction: 'asc' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        return handleEdit(data)
                    }
                }}
                tableId="products-table"
                title="Daftar Produk"
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                swrOptions={{
                    revalidateOnMount: true,
                }}
                setRowProps={(_, dataIndex) => {
                    const data = getRowData(dataIndex)
                    if (!data) return {}

                    if (data.deleted_at)
                        return {
                            sx: {
                                '& td': {
                                    color: 'var(--mui-palette-grey-800)',
                                },
                            },
                        }

                    return {}
                }}
            />

            <Dialog
                title={(isNew ? 'Tambah ' : 'Perbaharui ') + 'Produk'}
                open={formOpen}
                closeButtonProps={{
                    onClick: () => {
                        if (
                            isDirty &&
                            !window.confirm(
                                'Perubahan belum tersimpan, yakin ingin menutup?',
                            )
                        ) {
                            return
                        }

                        return handleClose()
                    },
                    disabled: loading,
                }}>
                <ProductForm parentDatatableMutator={mutate} />
            </Dialog>

            <Fab
                in={
                    userHasPermission(['create product', 'update product']) ??
                    false
                }
                onClick={handleCreate}>
                <InventoryIcon />
            </Fab>
        </>
    )
}

const columns: MUIDataTableColumn[] = [
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
        name: 'category_name',
        label: 'Kategori',
        options: {
            customBodyRender: text =>
                text ? (
                    <Chip label={text} size="small" variant="outlined" />
                ) : (
                    ''
                ),
        },
    },
    {
        name: 'description',
        label: 'Deskripsi',
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
        name: 'base_cost_rp_per_unit',
        label: 'Biaya Dasar',
        options: {
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },

    {
        name: 'default_sell_price',
        label: 'Harga Dasar',
        options: {
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },
]
