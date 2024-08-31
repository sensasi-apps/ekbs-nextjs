import type Product from './Product'

type ProductMovementDetail = {
    id: number
    // product_movement_uuid: UUID
    product_id: Product['id']
    qty: number
    rp_per_unit: number
    cost_rp_per_unit: number

    product_state: Product | null
    warehouse_state: Product['warehouses'][0] | null

    // relations
    product?: Product
}

export default ProductMovementDetail
