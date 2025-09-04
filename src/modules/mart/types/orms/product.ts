import type { Ymd } from '@/types/DateString'
import type Warehouse from '../../enums/product-warehouse-warehouse'

export default interface ProductORM {
    id: Readonly<number>
    code?: string
    barcode_reg_id?: string
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
