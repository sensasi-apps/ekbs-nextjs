'use client'

// types
import type Product from '@/modules/mart/types/orms/product'
import type YajraDatatable from '@/types/yajra-datatable-response'
// vendors
import { useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// components
import ApiUrl from '@/components/pages/marts/products/ApiUrl'
import ChipSmall from '@/components/ChipSmall'
import Datatable, {
    type DatatableProps,
    getNoWrapCellProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import ProductForm, {
    type FormValues,
} from '@/components/pages/marts/products/Form'
// utils
import handle422 from '@/utils/handle-422'
import formatNumber from '@/utils/format-number'
import FarmInputsProductsLowQty from '@/components/pages/farm-inputs/products/LowQty'
import numberToCurrency from '@/utils/number-to-currency'
// enums
import Mart from '@/enums/permissions/Mart'
import Warehouse from '@/dataTypes/enums/MartDB/ProductWarehouses/Warehouse'
// utils
import aoaToXlsx from '@/utils/aoa-to-xlsx'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

let mutate: MutateType<Product>
let getRowData: GetRowDataType<Product>

export default function Products() {
    const isAuthHasPermission = useIsAuthHasPermission()

    const [selectedRow, setSelectedRow] = useState<Product>()
    const [formValues, setFormValues] = useState<FormValues>()
    const [isDownloading, setIsDownloading] = useState(false)

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
                defaultSortOrder={{ name: 'name', direction: 'asc' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        setFormValues(data as FormValues)
                        setSelectedRow(data)
                    }
                }}
                tableId="products-table"
                title="Daftar Produk"
                columns={columns}
                mutateCallback={fn => (mutate = fn)}
                getRowDataCallback={fn => (getRowData = fn)}
                swrOptions={{
                    revalidateOnMount: true,
                }}
                download={isDownloading ? 'disabled' : true}
                onDownload={() => {
                    if (isDownloading) return false

                    setIsDownloading(true)

                    downloadXlsx().then(() => setIsDownloading(false))

                    return false
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
            />

            <DialogWithTitle
                maxWidth="sm"
                title={
                    (selectedRow?.id === undefined ? 'Tambah' : 'Perbaharui') +
                    ' Data Produk'
                }
                open={Boolean(formValues)}>
                <Formik
                    initialValues={formValues ?? {}}
                    initialStatus={{
                        product: selectedRow,
                        handleDelete: () =>
                            getAxiosRequest('delete', selectedRow?.id).then(
                                onSubmitted,
                            ),
                    }}
                    onSubmit={(values, { setErrors }) =>
                        getAxiosRequest(
                            selectedRow?.id ? 'update' : 'create',
                            selectedRow?.id,
                            values,
                        )
                            .then(onSubmitted)
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={ProductForm}
                />
            </DialogWithTitle>

            <Fab
                in={isAuthHasPermission(Mart.CREATE_PRODUCT)}
                disabled={!!formValues}
                onClick={() => {
                    setFormValues({
                        unit: 'pcs',
                        warehouses: Object.values(Warehouse).map(warehouse => ({
                            warehouse,
                            cost_rp_per_unit: 0,
                            qty: 0,
                            default_sell_price: 0,
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
                text ? <ChipSmall label={text} variant="outlined" /> : '',
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
        name: 'warehouses.cost_rp_per_unit',
        label: 'Biaya Dasar',
        options: {
            searchable: false,
            customBodyRenderLite(dataIndex) {
                const warehouses = getRowData(dataIndex)?.warehouses
                if (!warehouses) return

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(({ cost_rp_per_unit }, i) => (
                            <li key={i}>
                                {numberToCurrency(cost_rp_per_unit)}
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
            customBodyRenderLite(dataIndex) {
                const warehouses = getRowData(dataIndex)?.warehouses
                if (!warehouses) return

                return (
                    <ul
                        style={{
                            margin: 0,
                            padding: 0,
                        }}>
                        {warehouses.map(({ default_sell_price, margin }, i) => (
                            <li key={i}>
                                {numberToCurrency(default_sell_price)}

                                {margin && (
                                    <ChipSmall
                                        variant="outlined"
                                        sx={{
                                            ml: 2,
                                        }}
                                        label={
                                            Math.round((margin - 1) * 100) +
                                            ' %'
                                        }
                                        color={
                                            margin - 1 < 0 ? 'error' : 'success'
                                        }
                                    />
                                )}
                            </li>
                        ))}
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
                length: undefined,
                columns,
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
