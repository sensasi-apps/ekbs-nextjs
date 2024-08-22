import type { ProductMovementWithSale } from '@/dataTypes/mart/ProductMovement'
import Datatable, { GetRowDataType } from '@/components/Datatable'
import IconButton from '@/components/IconButton'
import HistoryIcon from '@mui/icons-material/History'
import { Dialog } from '@mui/material'
import { useState } from 'react'
import ApiUrl from './ApiUrl'
import { MUIDataTableColumn, MUISortOptions } from 'mui-datatables'
import numberToCurrency from '@/utils/numberToCurrency'
import PrintHandler from '@/components/PrintHandler'
import Receipt from './ReceiptPreview/Receipt'

let getRowData: GetRowDataType<ProductMovementWithSale>

export default function HistoryDatatableModalAndButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <IconButton
                title="Riwayat"
                icon={HistoryIcon}
                onClick={() => setOpen(true)}
            />

            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                onClose={() => setOpen(false)}>
                <Datatable
                    apiUrl={ApiUrl.DATATABLE}
                    columns={DATATABLE_COLUMNS}
                    defaultSortOrder={DEFAULT_SORT_ORDER}
                    tableId="mart-sales-table"
                    title="Riwayat Penjualan"
                    getRowDataCallback={fn => (getRowData = fn)}
                />
            </Dialog>
        </>
    )
}

const DEFAULT_SORT_ORDER: MUISortOptions = {
    name: 'at',
    direction: 'desc',
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'sale.no',
        label: 'NO Struk',
        options: {
            customBodyRenderLite: dataIndex => getRowData(dataIndex)?.sale.no,
        },
    },
    {
        name: 'short_uuid',
        label: 'Kode',
        options: {
            display: false,
        },
    },
    {
        name: 'at',
        label: 'Waktu',
    },
    {
        name: 'logs.user.name',
        label: 'Kasir',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.logs?.[0]?.user?.name,
        },
    },
    {
        name: 'sale.buyerUser.name',
        label: 'Pelanggan',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.sale?.buyer_user?.name,
        },
    },

    {
        name: 'grand_total_rp',
        label: 'Total',
        options: {
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },
    {
        name: 'transaction.cashable.name',
        label: 'Pembayaran',
        options: {
            customBodyRenderLite: dataIndex => {
                const cashable = getRowData(dataIndex)?.transaction?.cashable

                if (cashable && 'name' in cashable) return cashable.name
            },
        },
    },
    {
        name: 'uuid',
        label: 'Cetak',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)

                if (!data) return

                const cashable = data.transaction?.cashable
                const transactionCashName =
                    cashable && 'name' in cashable ? cashable.name : '-'

                return (
                    <PrintHandler>
                        <Receipt
                            data={{
                                at: data.at,
                                saleNo: data.sale.no,
                                servedByUserName:
                                    data.logs?.[0]?.user.name ?? '-',
                                saleBuyerUser: data.sale?.buyer_user,
                                transactionCashName: transactionCashName,
                                details: data.details,
                                costs: data.costs,
                            }}
                        />
                    </PrintHandler>
                )
            },
        },
    },
]
