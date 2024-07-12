import type { UUID } from 'crypto'
import type ProductMovementDetail from './ProductMovementDetail'
import type TransactionType from './Transaction'
import type { Ymd } from '@/types/DateString'
import type ProductMovementType from './ProductMovement'

type ProductPurchase = {
    uuid: UUID
    order: Ymd
    due: Ymd | null
    paid: Ymd | null
    received: Ymd | null
    note: string | null
    product_movement: ProductMovementType
    product_movement_details: ProductMovementDetail[]
    transaction?: TransactionType

    // exists on the database, but unused here. handled by backend
    // product_movement_details_temp: ProductMovementDetail[]
}
export default ProductPurchase
