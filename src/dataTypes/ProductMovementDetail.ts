import type ProductType from './Product'

type ProductMovementDetailType = {
    product_id: number
    qty: number
    rp_per_unit: number
    rp_cost_per_unit: number

    // relations
    product?: ProductType
    product_state: ProductType
}

export default ProductMovementDetailType
