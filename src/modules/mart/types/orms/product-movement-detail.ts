import type ProductORM from './product'

export default interface ProductMovementDetailORM {
    id: number
    // product_movement_uuid: UUID
    product_id: ProductORM['id']
    qty: number
    rp_per_unit: number
    cost_rp_per_unit: number

    product_state: ProductORM | null
    warehouse_state: ProductORM['warehouses'][0] | null

    // relations
    product?: ProductORM
}
