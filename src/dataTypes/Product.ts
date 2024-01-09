import type { Ymd } from '@/types/DateString'

type ProductType = {
    id: number
    code?: string
    name: string
    unit: string
    category_name: string
    description?: string
    // note: string | null
    low_number: number | null
    base_cost_rp_per_unit: number
    default_sell_price: number
    qty: number
    deleted_at?: Ymd
}

export default ProductType
