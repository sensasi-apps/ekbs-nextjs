import Warehouse from '@/enums/Warehouse'
import type { Ymd } from '@/types/DateString'

export default interface Product {
    id: number
    code?: string
    name: string
    unit: string
    category_name: string
    description?: string
    low_number: number | null
    deleted_at?: Ymd
    warehouses: {
        warehouse: Warehouse
        base_cost_rp_per_unit: number
        default_sell_price: number
        qty: number
    }[]
}
