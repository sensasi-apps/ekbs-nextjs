// types
import type ProductType from '@/dataTypes/Product'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
// materials
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, {
    DatatableProps,
    getNoWrapCellProps,
    GetRowDataType,
    MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import ProductForm from '@/components/Product/Form'
// page components
import FarmInputsProductsLowQty from '@/components/pages/farm-inputs/products/LowQty'
// providers
import useAuth from '@/providers/Auth'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'
import DatatableEndpointEnum from '@/types/farm-inputs/DatatableEndpointEnum'
import DialogWithTitle from '@/components/DialogWithTitle'
import axios from '@/lib/axios'
import ApiUrlEnum from '@/components/Product/ApiUrlEnum'
import handle422 from '@/utils/errorCatcher'
import Warehouse from '@/enums/Warehouse'

let mutate: MutateType<ProductType>
let getRowData: GetRowDataType<ProductType>

export default function FarmInputsProducts() {
    const { userHasPermission } = useAuth()

    const [isFormOpen, setIsFormOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] = useState<
        Partial<ProductType>
    >({})

    const handleClose = () => setIsFormOpen(false)

    const isNew = !initialFormikValues?.id

    return (
        <AuthLayout title="Produk">
            <Datatable
                apiUrl={DatatableEndpointEnum.PRODUCTS}
                columns={columns}
                defaultSortOrder={{ name: 'name', direction: 'asc' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        setInitialFormikValues(data)
                        setIsFormOpen(true)
                    }
                }}
                tableId="products-table"
                title="Daftar Produk"
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                swrOptions={{
                    revalidateOnMount: true,
                }}
                setRowProps={(_, dataIndex) =>
                    getRowData(dataIndex)?.deleted_at
                        ? {
                              sx: {
                                  '& td': {
                                      color: 'text.disabled',
                                      textDecoration: 'line-through',
                                  },
                              },
                          }
                        : {}
                }
            />

            <DialogWithTitle
                maxWidth="sm"
                title={(isNew ? 'Tambah' : 'Perbaharui') + ' Data Produk'}
                open={isFormOpen}>
                <Formik
                    initialValues={initialFormikValues}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                ApiUrlEnum.UPDATE_OR_CREATE_PRODUCT.replace(
                                    '$1',
                                    values.id ? '/' + values.id : '',
                                ),
                                values,
                            )
                            .then(() => {
                                mutate()
                                handleClose()
                            })
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={ProductForm}
                />
            </DialogWithTitle>

            <Fab
                in={
                    userHasPermission(['create product', 'update product']) ??
                    false
                }
                onClick={() => {
                    setInitialFormikValues({
                        unit: 'pcs',
                        warehouses: Object.values(Warehouse).map(warehouse => ({
                            warehouse,
                            base_cost_rp_per_unit: 0,
                            qty: 0,
                            default_sell_price: 0,
                        })),
                    })
                    setIsFormOpen(true)
                }}
                title="Tambah Produk">
                <InventoryIcon />
            </Fab>
        </AuthLayout>
    )
}

const columns: DatatableProps<ProductType>['columns'] = [
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
        options: {
            display: false,
        },
    },
    {
        name: 'warehouses.warehouse',
        label: 'Gudang',
        options: {
            setCellProps: getNoWrapCellProps,
            customBodyRenderLite(dataIndex) {
                const warehouses = getRowData(dataIndex)?.warehouses
                if (!warehouses) return

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(({ warehouse }, i) => (
                            <li key={i}>{warehouse}</li>
                        ))}
                    </ul>
                )
            },
        },
    },
    {
        name: 'warehouses.qty',
        label: 'QTY',
        options: {
            setCellProps: getNoWrapCellProps,
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                if (!data) return

                const { low_number, warehouses } = data

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(({ qty }, i) => {
                            const content =
                                low_number !== null && qty <= low_number ? (
                                    <FarmInputsProductsLowQty>
                                        {formatNumber(qty)}
                                    </FarmInputsProductsLowQty>
                                ) : (
                                    formatNumber(qty)
                                )

                            return <li key={i}>{content}</li>
                        })}
                    </ul>
                )
            },
        },
    },
    {
        name: 'unit',
        label: 'Satuan',
    },
    {
        name: 'warehouses.base_cost_rp_per_unit',
        label: 'Biaya Dasar',
        options: {
            setCellProps: getNoWrapCellProps,
            customBodyRenderLite(dataIndex) {
                const warehouses = getRowData(dataIndex)?.warehouses
                if (!warehouses) return

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(({ base_cost_rp_per_unit }, i) => (
                            <li key={i}>
                                {numberToCurrency(base_cost_rp_per_unit)}
                            </li>
                        ))}
                    </ul>
                )
            },
        },
    },
    {
        name: 'warehouses.default_sell_price',
        label: 'Harga Jual Default',
        options: {
            setCellProps: getNoWrapCellProps,
            customBodyRenderLite(dataIndex) {
                const warehouses = getRowData(dataIndex)?.warehouses
                if (!warehouses) return

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(({ default_sell_price }, i) => (
                            <li key={i}>
                                {numberToCurrency(default_sell_price)}
                            </li>
                        ))}
                    </ul>
                )
            },
        },
    },
]
