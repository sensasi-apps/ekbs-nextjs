// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type ProductSaleType from '@/dataTypes/ProductSale'
// vendors
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
} from '@mui/material'
import { useState } from 'react'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, { type GetRowDataType } from '@/components/Datatable'
import ProductSaleReceipt from '@/components/pages/farm-input-product-sales/Receipt'
// utils
import toDmy from '@/utils/toDmy'
import nowrapMuiDatatableCellPropsFn from '@/utils/nowrapMuiDatatableCellPropsFn'
import formatNumber from '@/utils/formatNumber'

let getRowData: GetRowDataType<ProductSaleType>

export default function Page() {
    const [receiptDialogData, setReceiptDialogData] =
        useState<ProductSaleType>()

    return (
        <AuthLayout title="Pembelian Anda">
            <Datatable
                title="Riwayat"
                tableId="farm-input-my-purchases-table"
                apiUrl="/farm-inputs/my-purchases/datatable-data"
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (!data) return

                        setReceiptDialogData(data)
                    }
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
                getRowDataCallback={fn => (getRowData = fn)}
            />

            <Dialog
                open={Boolean(receiptDialogData)}
                onClose={() => setReceiptDialogData(undefined)}>
                <DialogActions
                    sx={{
                        p: 0,
                    }}>
                    <Button
                        onClick={() => setReceiptDialogData(undefined)}
                        color="warning"
                        fullWidth>
                        Tutup
                    </Button>
                </DialogActions>

                {receiptDialogData && (
                    <DialogContent
                        sx={{
                            pb: 8,
                            pt: 0,
                        }}>
                        <ProductSaleReceipt data={receiptDialogData} />
                    </DialogContent>
                )}
            </Dialog>
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'at',
        label: 'TGL',
        options: {
            setCellProps: nowrapMuiDatatableCellPropsFn,
            customBodyRender: toDmy,
        },
    },
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: 'excluded',
            sort: false,
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
        name: 'productMovement.details.product_state',
        label: 'Barang',
        options: {
            sort: false,
            setCellProps: () => ({
                sx: {
                    '& > div': {
                        display: 'flex',
                        gap: 1,
                    },
                    '& .MuiChip-root': {
                        textTransform: 'uppercase',
                        //     fontSize: '0.8rem !important',
                        //     fontFamily: 'monospace !important',
                    },
                },
            }),
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return ''

                return data.product_movement_details.map(
                    ({ id, qty, product_state }) => (
                        <Chip
                            key={id}
                            label={product_state.name + ' (' + qty * -1 + ')'}
                            size="small"
                        />
                    ),
                )
            },
        },
    },
    {
        name: 'total_rp',
        label: 'Total (Rp)',
        options: {
            setCellProps: nowrapMuiDatatableCellPropsFn,
            sort: false,
            searchable: false,
            customBodyRender: value => formatNumber(value ?? 0),
        },
    },

    {
        name: 'payment_method_id',
        label: 'Metode Pembayaran',
        options: {
            sort: false,
            searchable: false,
        },
    },
]
