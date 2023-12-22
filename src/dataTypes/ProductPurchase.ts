import type { UUID } from 'crypto'
import type ProductMovementDetailType from './ProductMovementDetail'
import type TransactionType from './Transaction'
import type { Ymd } from '@/types/DateString'
import type ProductMovementType from './ProductMovement'

type ProductPurchaseType = {
    uuid: UUID
    order: Ymd
    due: Ymd | null
    paid: Ymd | null
    received: Ymd | null
    note: string | null
    product_movement: ProductMovementType
    product_movement_details: ProductMovementDetailType[]
    transaction?: TransactionType

    // exists on the database, but unused here. handled by backend
    // product_movement_details_temp: ProductMovementDetailType[]
}
export default ProductPurchaseType
