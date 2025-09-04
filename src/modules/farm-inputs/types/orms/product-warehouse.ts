import type Warehouse from '@/modules/farm-inputs/enums/warehouse'

export default interface ProductWarehouseORM {
    id: number
    product_id: number
    warehouse: Warehouse
    qty: number
    default_sell_price: number
    base_cost_rp_per_unit: number
}
