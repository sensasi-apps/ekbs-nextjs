'use client'

// icons
import InventoryIcon from '@mui/icons-material/Inventory'
// vendors
import { useState } from 'react'
import ApiUrl from '@/app/(auth)/marts/products/purchases/_parts/api-url'
import { type FormValues } from '@/app/(auth)/marts/products/purchases/_parts/form'
import FormDialog from '@/app/(auth)/marts/products/purchases/_parts/form-dialog'
// components
import ChipSmall from '@/components/chip-small'
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    getNoWrapCellProps,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/fab'
import Mart from '@/enums/permissions/Mart'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// parts
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
// utils
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'

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
                apiUrl={ApiUrl.GET_DATATABLE_DATA}
                columns={columns}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        setFormValues({
                            at: data.at,
                            cashable_uuid: data.transaction?.cashable_uuid,

                            costs: data.costs,

                            details: data.details.map(detail => ({
                                cost_rp_per_unit: detail.cost_rp_per_unit,
                                product: detail.product_state ?? detail.product,
                                product_id: detail.product_id,
                                qty: detail.qty,
                                rp_per_unit: detail.rp_per_unit,
                            })),
                            note: data.note,
                            paid: data.purchase?.paid,

                            received: data.purchase?.received,
                        })

                        setSelectedRow(data)
                    }
                }}
                setRowProps={getNoWrapCellProps}
                tableId="product-purchase-table"
                title="Dafar Pembelian"
            />

            <FormDialog
                formValues={formValues}
                handleClose={handleClose}
                onSumbitted={onSubmitted}
                selectedRow={selectedRow}
            />

            <Fab
                disabled={!!formValues}
                in={isAuthHasPermission(Mart.CREATE_PURCHASE)}
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
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: (value: string) => toDmy(value),
        },
    },

    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: false,
        },
    },

    {
        label: 'Kode',
        name: 'short_uuid',
        options: {
            searchable: false,
            sort: false,
        },
    },

    {
        label: 'TGL Terima',
        name: 'purchase.received',
        options: {
            customBodyRenderLite(dataIndex) {
                const paid = getRowData(dataIndex)?.purchase?.received

                return paid ? toDmy(paid) : ''
            },
        },
    },
    {
        label: 'TGL Lunas',
        name: 'purchase.paid',
        options: {
            customBodyRenderLite(dataIndex) {
                const received = getRowData(dataIndex)?.purchase?.paid

                return received ? toDmy(received) : ''
            },
        },
    },
    {
        label: 'Catatan',
        name: 'note',
    },

    {
        label: 'Produk',
        name: 'details.product_state',
        options: {
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                if (!data) return

                const productPreviews = data.details
                    .slice(0, 10)
                    .map(({ id, product_state, product }) => (
                        <ChipSmall
                            key={id}
                            label={(product_state ?? product)?.name}
                            sx={{
                                m: 0.3,
                            }}
                        />
                    ))

                if (data.details.length > 10) {
                    productPreviews.push(
                        <ChipSmall
                            disabled
                            key="more"
                            label={`+${data.details.length - 10} lainnya`}
                            sx={{
                                m: 0.3,
                            }}
                        />,
                    )
                }

                return productPreviews
            },
            setCellProps: () => ({
                style: {
                    whiteSpace: 'normal',
                },
            }),
        },
    },
    {
        label: 'Grand Total (Rp)',
        name: 'grand_total_rp',
        options: {
            customBodyRender: value => formatNumber(value),
            searchable: false,
            sort: false,
        },
    },
]
