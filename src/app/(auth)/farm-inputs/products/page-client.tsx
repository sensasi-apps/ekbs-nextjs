'use client'

// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// materials
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    getNoWrapCellProps,
    type MutateType,
} from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import FlexBox from '@/components/flex-box'
import ApiUrlEnum from '@/components/Product/ApiUrlEnum'
import ProductForm from '@/components/Product/Form'
// page components
import FarmInputsProductsLowQty from '@/components/pages/farm-inputs/products/LowQty'
import WithDeletedItemsCheckbox from '@/components/with-deleted-items-checkbox'
import FarmInputPermission from '@/enums/permissions/FarmInput'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import DatatableEndpointEnum from '@/modules/farm-inputs/enums/datatable-endpoint'
// enums
import Warehouse from '@/modules/farm-inputs/enums/warehouse'
// types
import type ProductType from '@/modules/farm-inputs/types/orms/product'
import formatNumber from '@/utils/format-number'
import handle422 from '@/utils/handle-422'
// utils
import numberToCurrency from '@/utils/number-to-currency'

let mutate: MutateType<ProductType>
let getRowData: GetRowDataType<ProductType>

export default function PageClient() {
    const isAuthHasPermission = useIsAuthHasPermission()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [withDeletedItems, setWithDeletedItems] = useState(false)

    const [initialFormikValues, setInitialFormikValues] = useState<
        Partial<ProductType>
    >({})

    const handleClose = () => setIsFormOpen(false)

    const isNew = !initialFormikValues?.id

    return (
        <>
            <FlexBox justifyContent="end" mb={2}>
                <WithDeletedItemsCheckbox
                    checked={withDeletedItems}
                    onChange={setWithDeletedItems}
                />
            </FlexBox>

            <Datatable
                apiUrl={DatatableEndpointEnum.PRODUCTS}
                apiUrlParams={{
                    withDeletedItems: withDeletedItems ? '1' : '0',
                }}
                columns={columns}
                defaultSortOrder={{ direction: 'asc', name: 'name' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        setInitialFormikValues(data)
                        setIsFormOpen(true)
                    }
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
                swrOptions={{
                    revalidateOnMount: true,
                }}
                tableId="products-table"
                title="Daftar Produk"
            />

            <DialogWithTitle
                maxWidth="sm"
                open={isFormOpen}
                title={(isNew ? 'Tambah' : 'Perbaharui') + ' Data Produk'}>
                <Formik
                    component={ProductForm}
                    initialValues={initialFormikValues}
                    onReset={handleClose}
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
                />
            </DialogWithTitle>

            <Fab
                in={
                    isAuthHasPermission([
                        FarmInputPermission.CREATE_PRODUCT,
                        FarmInputPermission.UPDATE_PRODUCT,
                    ]) ?? false
                }
                onClick={() => {
                    setInitialFormikValues({
                        unit: 'pcs',
                        warehouses: Object.values(Warehouse).map(warehouse => ({
                            base_cost_rp_per_unit: 0,
                            default_sell_price: 0,
                            qty: 0,
                            warehouse,
                        })),
                    })
                    setIsFormOpen(true)
                }}
                title="Tambah Produk">
                <InventoryIcon />
            </Fab>
        </>
    )
}

const columns: DatatableProps<ProductType>['columns'] = [
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
        label: 'Kategori',
        name: 'category_name',
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
        label: 'Deskripsi',
        name: 'description',
        options: {
            display: false,
        },
    },
    {
        label: 'Gudang',
        name: 'warehouses.warehouse',
        options: {
            customBodyRenderLite(dataIndex) {
                const warehouses = getRowData(dataIndex)?.warehouses
                if (!warehouses) return

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(({ warehouse }) => (
                            <li key={warehouse}>{warehouse}</li>
                        ))}
                    </ul>
                )
            },
            setCellProps: getNoWrapCellProps,
        },
    },
    {
        label: 'QTY',
        name: 'warehouses.qty',
        options: {
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
                        {warehouses.map(({ qty, warehouse }) => {
                            const content =
                                low_number !== null && qty <= low_number ? (
                                    <FarmInputsProductsLowQty>
                                        {formatNumber(qty)}
                                    </FarmInputsProductsLowQty>
                                ) : (
                                    formatNumber(qty)
                                )

                            return <li key={warehouse}>{content}</li>
                        })}
                    </ul>
                )
            },
            setCellProps: getNoWrapCellProps,
        },
    },
    {
        label: 'Satuan',
        name: 'unit',
    },
    {
        label: 'Biaya Dasar',
        name: 'warehouses.base_cost_rp_per_unit',
        options: {
            customBodyRenderLite(dataIndex) {
                const warehouses = getRowData(dataIndex)?.warehouses
                if (!warehouses) return

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(
                            ({ base_cost_rp_per_unit, warehouse }) => (
                                <li key={warehouse}>
                                    {numberToCurrency(base_cost_rp_per_unit)}
                                </li>
                            ),
                        )}
                    </ul>
                )
            },
            setCellProps: getNoWrapCellProps,
        },
    },
    {
        label: 'Harga Jual Default',
        name: 'warehouses.default_sell_price',
        options: {
            customBodyRenderLite(dataIndex) {
                const warehouses = getRowData(dataIndex)?.warehouses
                if (!warehouses) return

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(({ default_sell_price, warehouse }) => (
                            <li key={warehouse}>
                                {numberToCurrency(default_sell_price)}
                            </li>
                        ))}
                    </ul>
                )
            },
            setCellProps: getNoWrapCellProps,
        },
    },
]
