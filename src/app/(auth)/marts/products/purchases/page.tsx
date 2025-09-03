'use client'

// vendors
import { useState } from 'react'
// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// components
import ChipSmall from '@/components/ChipSmall'
import Datatable, {
    type DatatableProps,
    getNoWrapCellProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
// utils
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// parts
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
import { type FormValues } from '@/app/(auth)/marts/products/purchases/_parts/form'
import Mart from '@/enums/permissions/Mart'
import FormDialog from '@/app/(auth)/marts/products/purchases/_parts/form-dialog'
import ApiUrl from '@/app/(auth)/marts/products/purchases/_parts/api-url'

let mutate: MutateType<ProductMovement>
let getRowData: GetRowDataType<ProductMovement>

export default function ProductPurchases() {
    const isAuthHasPermission = useIsAuthHasPermission()

    const [selectedRow, setSelectedRow] = useState<ProductMovement>()
    const [formValues, setFormValues] = useState<FormValues>()

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
            <Datatable
                title="Dafar Pembelian"
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
                                cost_rp_per_unit: detail.cost_rp_per_unit,
                            })),

                            costs: data.costs,
                        })

                        setSelectedRow(data)
                    }
                }}
                tableId="product-purchase-table"
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                columns={columns}
                setRowProps={getNoWrapCellProps}
            />

            <FormDialog
                formValues={formValues}
                selectedRow={selectedRow}
                onSumbitted={onSubmitted}
                handleClose={handleClose}
            />

            <Fab
                in={isAuthHasPermission(Mart.CREATE_PURCHASE)}
                disabled={!!formValues}
                onClick={() => {
                    setFormValues({})
                    setSelectedRow(undefined)
                }}
                title="Tambah Produk">
                <InventoryIcon />
            </Fab>
        </>
    )
}

const columns: DatatableProps<ProductMovement>['columns'] = [
    {
        name: 'at',
        label: 'TGL',
        options: {
            customBodyRender: (value: string) => toDmy(value),
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
            setCellProps: () => ({
                style: {
                    whiteSpace: 'normal',
                },
            }),
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                if (!data) return

                const productPreviews = data.details
                    .slice(0, 10)
                    .map(({ product_state, product }, i) => (
                        <ChipSmall
                            key={i}
                            sx={{
                                m: 0.3,
                            }}
                            label={(product_state ?? product)?.name}
                        />
                    ))

                if (data.details.length > 10) {
                    productPreviews.push(
                        <ChipSmall
                            key="more"
                            disabled
                            sx={{
                                m: 0.3,
                            }}
                            label={`+${data.details.length - 10} lainnya`}
                        />,
                    )
                }

                return productPreviews
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
