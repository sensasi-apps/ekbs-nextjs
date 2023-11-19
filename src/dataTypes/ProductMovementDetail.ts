import type ProductType from './Product'

type ProductMovementDetailType = {
    product_id: number
    product: ProductType
    qty: number
    rp_per_unit: number
}

export default ProductMovementDetailType
