import AuthLayout from '@/components/Layouts/AuthLayout'
import { FormDataProvider } from '@/providers/useFormData'

export default function FarmInputsProducts() {
    return (
        <AuthLayout title="Produk">
            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

import type ProductType from '@/dataTypes/Product'
import type { MUIDataTableColumn } from 'mui-datatables'

import { NumericFormat } from 'react-number-format'
import Fab from '@mui/material/Fab'
// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// providers
import useFormData from '@/providers/useFormData'
// components
import Datatable, { getDataRow, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import ProductForm from '@/components/Product/Form'
// libs
import useAuth from '@/providers/Auth'
import { Box, Tooltip } from '@mui/material'
import numericFormatDefaultProps from '@/utils/numericFormatDefaultProps'

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
                        const data = getDataRow<ProductType>(dataIndex)
                        if (!data) return

                        return handleEdit(data)
                    }
                }}
                tableId="products-table"
                title="Daftar Produk"
            />

            <Dialog
                title={(isNew ? 'Tambah ' : 'Perbaharui ') + 'Produk'}
                maxWidth="md"
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

            {userHasPermission(['create product', 'update product']) && (
                <Fab
                    disabled={formOpen}
                    onClick={handleCreate}
                    color="success"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}>
                    <InventoryIcon />
                </Fab>
            )}
        </>
    )
}

import { keyframes } from '@mui/system'

const blink = keyframes`
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
`

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
                const data = getDataRow<ProductType>(dataIndex)
                if (!data) return

                const mainContent = (
                    <NumericFormat
                        {...numericFormatDefaultProps}
                        allowNegative={true}
                        value={data.qty}
                        suffix={' ' + data.unit}
                        displayType="text"
                    />
                )

                return data.qty > data.low_number ? (
                    mainContent
                ) : (
                    <Tooltip title="Persediaan menipis" placement="top" arrow>
                        <Box
                            fontWeight="bold"
                            whiteSpace="nowrap"
                            color="warning.main"
                            sx={{
                                animation: `${blink} 1s linear infinite`,
                            }}
                            component="span">
                            {mainContent}
                        </Box>
                    </Tooltip>
                )
            },
        },
    },
    {
        name: 'base_cost_rp_per_unit',
        label: 'Biaya Dasar',
        options: {
            customBodyRender: (value: number) => (
                <NumericFormat
                    style={{
                        whiteSpace: 'nowrap',
                    }}
                    prefix="Rp "
                    value={value}
                    decimalSeparator=","
                    thousandSeparator="."
                    displayType="text"
                />
            ),
        },
    },

    {
        name: 'default_sell_price',
        label: 'Harga Dasar',
        options: {
            customBodyRender: (value: number) => (
                <NumericFormat
                    style={{
                        whiteSpace: 'nowrap',
                    }}
                    prefix="Rp "
                    value={value}
                    decimalSeparator=","
                    thousandSeparator="."
                    displayType="text"
                />
            ),
        },
    },
]
