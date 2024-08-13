// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type { Ymd } from '@/types/DateString'
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
// vendors
import { useState } from 'react'
// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, {
    getNoWrapCellProps,
    GetRowDataType,
    MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import FormDialog from '@/components/pages/marts/products/purchases/FormDialog'
import { FormValues } from '@/components/pages/marts/products/purchases/Form'
import ApiUrl from '@/components/pages/marts/products/purchases/ApiUrl'
// utils
import formatNumber from '@/utils/formatNumber'
import toDmy from '@/utils/toDmy'
// etc
import useAuth from '@/providers/Auth'
import ChipSmall from '@/components/ChipSmall'
import Mart from '@/enums/permissions/Mart'

let mutate: MutateType<ProductMovement>
let getRowData: GetRowDataType<ProductMovement>

export default function ProductPurchases() {
    const { userHasPermission } = useAuth()

    const [selectedRow, setSelectedRow] = useState<ProductMovement>()
    const [formValues, setFormValues] = useState<FormValues>()

    function handleClose() {
        setSelectedRow(undefined)
        setFormValues(undefined)
    }

    function onSumbitted() {
        mutate()
        handleClose()
    }

    return (
        <AuthLayout title="Pembelian">
            <Datatable
                apiUrl={ApiUrl.GET_DATATABLE_DATA}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        setFormValues({
                            at: data.at,
                            note: data.note,

                            received: data.purchase?.received,
                            paid: data.purchase?.paid,
                            cashable_uuid: data.transaction?.cashable_uuid,

                            details: data.details.map(detail => ({
                                qty: detail.qty,
                                product: detail.product_state ?? detail.product,
                                product_id: detail.product_id,
                                rp_per_unit: detail.rp_per_unit,
                                cost_rp_total:
                                    detail.cost_rp_per_unit * detail.qty,
                            })),

                            costs: data.costs,
                        })

                        setSelectedRow(data)
                    }
                }}
                tableId="products-table"
                title="Daftar Produk"
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                columns={columns}
                setRowProps={getNoWrapCellProps}
            />

            <FormDialog
                formValues={formValues}
                selectedRow={selectedRow}
                onSumbitted={onSumbitted}
                handleClose={handleClose}
            />

            <Fab
                in={userHasPermission(Mart.CREATE_PURCHASE)}
                disabled={!!formValues}
                onClick={() => {
                    setFormValues({})
                    setSelectedRow(undefined)
                }}
                title="Tambah Produk">
                <InventoryIcon />
            </Fab>
        </AuthLayout>
    )
}

const columns: MUIDataTableColumn[] = [
    {
        name: 'at',
        label: 'TGL',
        options: {
            customBodyRender: (value: Ymd) => toDmy(value),
        },
    },

    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },

    {
        name: 'short_uuid',
        label: 'Kode',
        options: {
            searchable: false,
            sort: false,
        },
    },

    {
        name: 'purchase.received',
        label: 'TGL Terima',
        options: {
            customBodyRenderLite(dataIndex) {
                const paid = getRowData(dataIndex)?.purchase?.received

                return paid ? toDmy(paid) : ''
            },
        },
    },
    {
        name: 'purchase.paid',
        label: 'TGL Lunas',
        options: {
            customBodyRenderLite(dataIndex) {
                const received = getRowData(dataIndex)?.purchase?.paid

                return received ? toDmy(received) : ''
            },
        },
    },
    {
        name: 'note',
        label: 'Catatan',
    },

    {
        name: 'details.product_state',
        label: 'Produk',
        options: {
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                if (!data) return

                return data.details.map(({ product_state, product }, i) => (
                    <ChipSmall
                        key={i}
                        label={(product_state ?? product)?.name}
                    />
                ))
            },
        },
    },
    {
        name: 'grand_total_rp',
        label: 'Grand Total (Rp)',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: value => formatNumber(value),
        },
    },
]
