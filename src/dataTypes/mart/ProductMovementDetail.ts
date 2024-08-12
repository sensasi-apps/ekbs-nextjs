import type Product from '../Product'

type ProductMovementDetail = {
    // product_movement_uuid: UUID
    product_id: Product['id']
    qty: number
    rp_per_unit: number
    cost_rp_per_unit: number
    warehouse_state: Product['warehouses'][0]
    product_state: Product

    // relations
    product?: Product
}

export default ProductMovementDetail
