import type ProductMovementDetailType from './ProductMovementDetail'

type ProductMovementType = {
    at: string
    type: 'purchase' | 'opname' | 'grant'
    details: ProductMovementDetailType[]
    note: string
}

export default ProductMovementType
