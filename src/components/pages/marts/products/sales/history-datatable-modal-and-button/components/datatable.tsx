// types

// components
import DefaultDatatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import PrintHandler from '@/components/PrintHandler'
import type ProductMovementWithSale from '@/modules/mart/types/orms/product-movement-with-sale'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import Receipt from '../../../../../../../app/mart-product-sales/_parts/shared-subcomponents/receipt'

let getRowData: GetRowDataType<ProductMovementWithSale>

export default function Datatable() {
    return (
        <DefaultDatatable
            apiUrl="marts/products/sales/datatable"
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={DEFAULT_SORT_ORDER}
            getRowDataCallback={fn => (getRowData = fn)}
            tableId="mart-sales-table"
            title="Riwayat Penjualan"
        />
    )
}

const DEFAULT_SORT_ORDER = {
    direction: 'desc' as const,
    name: 'at',
}

const DATATABLE_COLUMNS: DatatableProps<ProductMovementWithSale>['columns'] = [
    {
        label: 'NO Struk',
        name: 'sale.no',
    },
    {
        label: 'Kode',
        name: 'short_uuid',
        options: {
            display: false,
        },
    },
    {
        label: 'Waktu',
        name: 'at',
    },
    {
        label: 'Kasir',
        name: 'by_user.name',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Pelanggan',
        name: 'sale.buyer_user.name',
        options: {
            searchable: false,
            sort: false,
        },
    },

    {
        label: 'Total',
        name: 'grand_total_rp',
        options: {
            customBodyRender: (value: number) =>
                numberToCurrency(Math.abs(value)),
        },
    },
    {
        label: 'Pembayaran',
        name: 'transaction.cashable.name',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Cetak',
        name: 'uuid',
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
                                costs: data.costs,
                                details: data.details,
                                saleBuyerUser: data.sale?.buyer_user,
                                saleNo: data.sale.no,
                                servedByUserName: data.by_user?.name ?? '-',
                                totalPayment: data.sale.total_payment,
                                transactionCashName: transactionCashName,
                            }}
                        />
                    </PrintHandler>
                )
            },
        },
    },
]
