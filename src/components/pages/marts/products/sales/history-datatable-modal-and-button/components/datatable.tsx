// types
import type ProductMovementWithSale from '@/dataTypes/mart/product-movement-with-sale'
// components
import DefaultDatatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import ApiUrl from '../../@enums/api-url'
import PrintHandler from '@/components/PrintHandler'
import Receipt from '../../@shared-subcomponents/receipt'

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

const DEFAULT_SORT_ORDER = {
    name: 'at',
    direction: 'desc' as const,
}

const DATATABLE_COLUMNS: DatatableProps<ProductMovementWithSale>['columns'] = [
    {
        name: 'sale.no',
        label: 'NO Struk',
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
        name: 'by_user.name',
        label: 'Kasir',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        name: 'sale.buyer_user.name',
        label: 'Pelanggan',
        options: {
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
                                totalPayment: data.sale.total_payment,
                            }}
                        />
                    </PrintHandler>
                )
            },
        },
    },
]
