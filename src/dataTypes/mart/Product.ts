import type { Ymd } from '@/types/DateString'
import Warehouse from '../enums/MartDB/ProductWarehouses/Warehouse'

type Product = {
    id: number
    code?: string
    name: string
    unit: string
    category_name: string
    description?: string
    low_number: number | null
    deleted_at?: Ymd

    // relations
    warehouses: {
        warehouse: Warehouse
        qty: number
        cost_rp_per_unit: number
        default_sell_price: number

        // getter
        margin?: number | null
    }[]
}

export default Product
