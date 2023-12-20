// types
import type ProductType from '@/dataTypes/Product'
import type { MUIDataTableColumn } from 'mui-datatables'
import type { KeyedMutator } from 'swr'
// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import Fab from '@/components/Fab'
import ProductForm from '@/components/Product/Form'
// page components
import FarmInputsProductsLowQty from './products/LowQty'
// providers
import { FormDataProvider } from '@/providers/useFormData'
import useAuth from '@/providers/Auth'
import useFormData from '@/providers/useFormData'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'

let mutate: KeyedMutator<ProductType[]>
let getDataRow: (dataIndex: number) => ProductType | undefined

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
                apiUrl="/farm-inputs/products/datatable"
                columns={columns}
                defaultSortOrder={{ name: 'name', direction: 'asc' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getDataRow(dataIndex)
                        if (!data) return

                        return handleEdit(data)
                    }
                }}
                tableId="products-table"
                title="Daftar Produk"
                getDataByRowCallback={fn => (getDataRow = fn)}
                mutateCallback={fn => (mutate = fn)}
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
        name: 'code',
        label: 'Kode',
    },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'category_name',
        label: 'Kategori',
    },
    {
        name: 'description',
        label: 'Deskripsi',
    },
    {
        name: 'qty',
        label: 'Jumlah',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getDataRow(dataIndex)
                if (!data) return

                const { qty, low_number, unit } = data

                const isLowQty = low_number !== null && qty <= low_number

                const text = `${formatNumber(qty)} ${unit}`

                if (!isLowQty) return text

                return (
                    <FarmInputsProductsLowQty>{text}</FarmInputsProductsLowQty>
                )
            },
        },
    },
    {
        name: 'base_cost_rp_per_unit',
        label: 'Biaya Dasar',
        options: {
            customBodyRender: numberToCurrency,
        },
    },

    {
        name: 'default_sell_price',
        label: 'Harga Dasar',
        options: {
            customBodyRender: numberToCurrency,
        },
    },
]
