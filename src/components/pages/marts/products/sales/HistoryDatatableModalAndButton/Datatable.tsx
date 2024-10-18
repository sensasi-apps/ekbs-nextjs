// types
import type ProductMovementWithSale from '@/dataTypes/mart/ProductMovementWithSale'
import type { MUIDataTableColumn, MUISortOptions } from 'mui-datatables'
// components
import DefaultDatatable, { GetRowDataType } from '@/components/Datatable'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import ApiUrl from '../ApiUrl'
import PrintHandler from '@/components/PrintHandler'
import Receipt from '../ReceiptPreview/Receipt'

let getRowData: GetRowDataType<ProductMovementWithSale>

export default function Datatable() {
    return (
        <DefaultDatatable
            apiUrl={ApiUrl.DATATABLE}
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={DEFAULT_SORT_ORDER}
            tableId="mart-sales-table"
            title="Riwayat Penjualan"
            getRowDataCallback={fn => (getRowData = fn)}
        />
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
        name: 'byUser.name',
        label: 'Kasir',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.by_user?.name,
            searchable: false,
            sort: false,
        },
    },
    {
        name: 'sale.buyerUser.name',
        label: 'Pelanggan',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.sale?.buyer_user?.name,
            searchable: false,
            sort: false,
        },
    },

    {
        name: 'grand_total_rp',
        label: 'Total',
        options: {
            customBodyRender: (value: number) =>
                numberToCurrency(Math.abs(value)),
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
            searchable: false,
            sort: false,
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
                                servedByUserName: data.by_user?.name ?? '-',
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
