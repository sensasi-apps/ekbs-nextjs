import type { UUID } from 'crypto'
import type ProductMovementType from './ProductMovement'
import ProductMovementDetailType from './ProductMovementDetail'
import TransactionType from './Transaction'

type ProductPurchaseType = {
    uuid: UUID
    order: string
    due: string
    paid: string
    received: string
    product_movement: ProductMovementType
    product_movement_details: ProductMovementDetailType[]
    transaction: TransactionType
    note: string
}

export default ProductPurchaseType
