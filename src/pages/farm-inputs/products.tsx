import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import { FormDataProvider } from '@/providers/useFormData'

export default function FarmInputsProducts() {
    return (
        <AuthLayout title="Produk">
            <Head>
                <title>{`Produk — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

import type ProductType from '@/dataTypes/Product'
import { NumericFormat } from 'react-number-format'
import Fab from '@mui/material/Fab'
// icons
import HandymanIcon from '@mui/icons-material/Handyman'
// providers
import useFormData from '@/providers/useFormData'
// components
import Datatable, { getDataRow, mutate } from '@/components/Global/Datatable'
import Dialog from '@/components/Global/Dialog'
import ProductForm from '@/components/Product/Form'
// libs
import useAuth from '@/providers/Auth'

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

    // 'unit', 'note', 'low_number'

    const columns = [
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
                customBodyRender: (value: number, rowMeta: any) => (
                    <NumericFormat
                        value={value}
                        suffix={
                            ' ' + getDataRow<ProductType>(rowMeta.rowIndex).unit
                        }
                        decimalSeparator=","
                        thousandSeparator="."
                        decimalScale={2}
                        displayType="text"
                    />
                ),
            },
        },
        {
            name: 'base_cost_rp_per_unit',
            label: 'Harga Dasar',
            options: {
                customBodyRender: (value: number) => (
                    <NumericFormat
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

    return (
        <>
            <Datatable
                apiUrl="/farm-inputs/products/datatable"
                columns={columns}
                defaultSortOrder={{ name: 'name', direction: 'asc' }}
                onRowClick={(_, rowMeta) =>
                    handleEdit(getDataRow(rowMeta.rowIndex))
                }
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
                    <HandymanIcon />
                </Fab>
            )}
        </>
    )
}
