import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import { FormDataProvider } from '@/providers/useFormData'

export default function FarmInputsProducts() {
    return (
        <AuthLayout title="Pembelian Produk">
            <Head>
                <title>{`Pembelian Produk — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

import type ProductType from '@/dataTypes/Product'
import type ProductMovementDetailType from '@/dataTypes/ProductMovementDetail'
import type { MUIDataTableColumn } from 'mui-datatables'

import { NumericFormat } from 'react-number-format'
import Fab from '@mui/material/Fab'
// components
import Datatable, { getDataRow, mutate } from '@/components/Global/Datatable'
import Dialog from '@/components/Global/Dialog'
import ProductPurchaseForm from '@/components/ProductPurchase/Form'
// icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
// libs
import ymdToDmy from '@/utils/ymdToDmy'
// providers
import useAuth from '@/providers/Auth'
import useFormData from '@/providers/useFormData'

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
                apiUrl="/farm-inputs/product-purchases/datatable"
                columns={columns}
                defaultSortOrder={{ name: 'order', direction: 'desc' }}
                onRowClick={(_, rowMeta, event) =>
                    event.detail === 2 &&
                    handleEdit(getDataRow(rowMeta.rowIndex))
                }
                tableId="product-purchases-table"
                title="Riwayat Pembelian"
            />

            <Dialog
                title={(isNew ? 'Tambah ' : 'Perbaharui ') + 'Data Pembelian'}
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
                <ProductPurchaseForm parentDatatableMutator={mutate} />
            </Dialog>

            {userHasPermission([
                'create product purchase',
                'update product purchase',
            ]) && (
                <Fab
                    disabled={formOpen}
                    onClick={handleCreate}
                    color="success"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}>
                    <ShoppingCartIcon />
                </Fab>
            )}
        </>
    )
}

const columns: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'order',
        label: 'Dipesan Tanggal',
        options: {
            customBodyRender: (value: string) => ymdToDmy(value),
        },
    },
    {
        name: 'due',
        label: 'Jatuh Tempo Tanggal',
        options: {
            customBodyRender: (value: string) => ymdToDmy(value),
        },
    },
    {
        name: 'paid',
        label: 'Dibayar Tanggal',
        options: {
            customBodyRender: (value: string) => ymdToDmy(value),
        },
    },
    {
        name: 'received',
        label: 'Diterima Tanggal',
        options: {
            customBodyRender: (value: string) => ymdToDmy(value),
        },
    },
    {
        name: 'note',
        label: 'Catatan',
        options: {
            sort: false,
        },
    },
    {
        name: 'productIn.details.product.name',
        options: {
            display: 'excluded',
            customBodyRenderLite: (dataIndex: number) => {
                return dataIndex
            },
        },
    },
    {
        name: 'product_movement_details_temp',
        options: {
            display: 'excluded',
            customBodyRenderLite: (dataIndex: number) => {
                return dataIndex
            },
        },
    },
    {
        name: 'product_movement_details',
        label: 'Barang',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (pids: ProductMovementDetailType[]) => (
                <ul
                    style={{
                        margin: 0,
                        padding: 0,
                        whiteSpace: 'nowrap',
                    }}>
                    {pids?.map(pid => (
                        <li key={pid.product_id}>
                            {
                                <NumericFormat
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    suffix={` ${pid.product?.unit} x `}
                                    value={pid.qty}
                                    displayType="text"
                                />
                            }
                            {
                                <NumericFormat
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix={`${pid.product?.name} @ Rp `}
                                    value={pid.rp_per_unit}
                                    displayType="text"
                                />
                            }{' '}
                        </li>
                    ))}
                </ul>
            ),
        },
    },
    {
        name: 'total_rp',
        label: 'Total',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (value: string) => (
                <NumericFormat
                    prefix="Rp "
                    style={{
                        whiteSpace: 'nowrap',
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    value={value}
                    displayType="text"
                />
            ),
        },
    },
]
