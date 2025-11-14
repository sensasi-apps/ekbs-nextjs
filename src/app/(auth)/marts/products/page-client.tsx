'use client'

// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// materials
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { Formik } from 'formik'
// vendors
import { useState } from 'react'
import ChipSmall from '@/components/chip-small'
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    getNoWrapCellProps,
    type MutateType,
} from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import FlexBox from '@/components/flex-box'
import FarmInputsProductsLowQty from '@/components/pages/farm-inputs/products/LowQty'
// components
import ApiUrl from '@/components/pages/marts/products/ApiUrl'
import ProductForm, {
    type FormValues,
} from '@/components/pages/marts/products/Form'
import WithDeletedItemsCheckbox from '@/components/with-deleted-items-checkbox'
// enums
import Mart from '@/enums/permissions/Mart'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import Warehouse from '@/modules/mart/enums/product-warehouse-warehouse'
// types
import type Product from '@/modules/mart/types/orms/product'
import type YajraDatatable from '@/types/yajra-datatable-response'
// utils
import aoaToXlsx from '@/utils/aoa-to-xlsx'
import formatNumber from '@/utils/format-number'
// utils
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'

let mutate: MutateType<Product>
let getRowData: GetRowDataType<Product>

export default function PageClient() {
    const isAuthHasPermission = useIsAuthHasPermission()

    const [selectedRow, setSelectedRow] = useState<Product>()
    const [formValues, setFormValues] = useState<FormValues>()
    const [isDownloading, setIsDownloading] = useState(false)
    const [withDeletedItems, setWithDeletedItems] = useState(false)

    function handleClose() {
        setSelectedRow(undefined)
        setFormValues(undefined)
    }

    function onSubmitted() {
        mutate()
        handleClose()
    }

    return (
        <>
            <FlexBox justifyContent="end" mb={2}>
                <WithDeletedItemsCheckbox
                    checked={withDeletedItems}
                    onChange={setWithDeletedItems}
                />
            </FlexBox>

            <Fade in={isDownloading}>
                <LinearProgress
                    sx={{
                        transform: 'translateY(0.2em)',
                        zIndex: 1,
                    }}
                />
            </Fade>

            <Datatable
                apiUrl={ApiUrl.GET_DATATABLE_DATA}
                apiUrlParams={{
                    withDeletedItems: withDeletedItems ? 1 : 0,
                }}
                columns={columns}
                defaultSortOrder={{ direction: 'asc', name: 'name' }}
                download={isDownloading ? 'disabled' : true}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                onDownload={() => {
                    if (isDownloading) return false

                    setIsDownloading(true)

                    downloadXlsx().then(() => setIsDownloading(false))

                    return false
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        setFormValues(data as FormValues)
                        setSelectedRow(data)
                    }
                }}
                setRowProps={(_, dataIndex) =>
                    getRowData(dataIndex)?.deleted_at
                        ? {
                              ...getNoWrapCellProps(),
                              sx: {
                                  '& td': {
                                      color: 'text.disabled',
                                      textDecoration: 'line-through',
                                  },
                              },
                          }
                        : getNoWrapCellProps()
                }
                swrOptions={{
                    revalidateOnMount: true,
                }}
                tableId="products-table"
                title=""
            />

            <DialogWithTitle
                maxWidth="sm"
                open={Boolean(formValues)}
                title={
                    (selectedRow?.id === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Produk'
                }>
                <Formik
                    component={ProductForm}
                    initialStatus={{
                        handleDelete: () =>
                            getAxiosRequest('delete', selectedRow?.id).then(
                                onSubmitted,
                            ),
                        product: selectedRow,
                    }}
                    initialValues={formValues ?? {}}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) =>
                        getAxiosRequest(
                            selectedRow?.id ? 'update' : 'create',
                            selectedRow?.id,
                            values,
                        )
                            .then(onSubmitted)
                            .catch(error => handle422(error, setErrors))
                    }
                />
            </DialogWithTitle>

            <Fab
                disabled={!!formValues}
                in={isAuthHasPermission(Mart.CREATE_PRODUCT)}
                onClick={() => {
                    setFormValues({
                        unit: 'pcs',
                        warehouses: Object.values(Warehouse).map(warehouse => ({
                            cost_rp_per_unit: 0,
                            default_sell_price: 0,
                            qty: 0,
                            warehouse,
                        })),
                    })
                    setSelectedRow(undefined)
                }}
                title="Tambah Produk">
                <InventoryIcon />
            </Fab>
        </>
    )
}

function getAxiosRequest(
    action: 'create' | 'update' | 'delete',
    id: number | undefined,
    values?: FormValues,
) {
    switch (action) {
        case 'create':
            return axios.post(ApiUrl.CREATE_PRODUCT, values)
        case 'update':
            return axios.put(
                ApiUrl.UPDATE_OR_DELETE_PRODUCT.replace(
                    '$',
                    id?.toString() ?? '',
                ),
                values,
            )
        case 'delete':
            return axios.delete(
                ApiUrl.UPDATE_OR_DELETE_PRODUCT.replace(
                    '$',
                    id?.toString() ?? '',
                ),
            )

        default:
            throw new Error('Invalid action')
    }
}

const columns: DatatableProps<Product>['columns'] = [
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
                text ? <ChipSmall label={text} variant="outlined" /> : '',
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
                        {warehouses.map(({ warehouse, qty }) => {
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
        },
    },
    {
        label: 'Satuan',
        name: 'unit',
    },
    {
        label: 'Biaya Dasar',
        name: 'warehouses.cost_rp_per_unit',
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
                        {warehouses.map(({ warehouse, cost_rp_per_unit }) => (
                            <li key={warehouse}>
                                {numberToCurrency(cost_rp_per_unit)}
                            </li>
                        ))}
                    </ul>
                )
            },
            searchable: false,
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
                        {warehouses.map(
                            ({ warehouse, default_sell_price, margin }) => (
                                <li key={warehouse}>
                                    {numberToCurrency(default_sell_price)}

                                    {margin && (
                                        <ChipSmall
                                            color={
                                                margin - 1 < 0
                                                    ? 'error'
                                                    : 'success'
                                            }
                                            label={
                                                Math.round((margin - 1) * 100) +
                                                ' %'
                                            }
                                            sx={{
                                                ml: 2,
                                            }}
                                            variant="outlined"
                                        />
                                    )}
                                </li>
                            ),
                        )}
                    </ul>
                )
            },
        },
    },
]

async function downloadXlsx() {
    return axios
        .get<YajraDatatable<Product>>(ApiUrl.GET_DATATABLE_DATA, {
            params: {
                columns,
                length: undefined,
                order: [{ column: 2, dir: 'asc' }],
            },
        })
        .then(response => {
            const data = response.data.data
            const aoa: (string | number)[][] = data.flatMap(
                ({ code, name, category_name, unit, warehouses, deleted_at }) =>
                    warehouses.map(
                        ({
                            warehouse,
                            qty,
                            cost_rp_per_unit,
                            default_sell_price,
                        }) => [
                            code ?? '',
                            name,
                            category_name,
                            warehouse,
                            qty,
                            unit,
                            cost_rp_per_unit,
                            default_sell_price,
                            deleted_at ?? '',
                        ],
                    ),
            )

            aoaToXlsx(
                `Daftar Produk Belayan Mart — ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
                aoa,
                [
                    ...columns
                        .filter(
                            ({ options }) =>
                                options?.display === undefined ||
                                options.display === true,
                        )
                        .map(col => col.label ?? col.name),
                    'Dihapus TGL',
                ],
            )
        })
}
