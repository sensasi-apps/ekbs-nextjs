import type { UUID } from 'crypto'
import type ProductMovementDetailORM from './product-movement-detail'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type { Ymd } from '@/types/date-string'
import type ProductMovementORM from './product-movement'

export default interface ProductPurchaseORM {
    uuid: UUID
    order: Ymd
    due: Ymd | null
    paid: Ymd | null
    received: Ymd | null
    note: string | null
    product_movement: ProductMovementORM
    product_movement_details: ProductMovementDetailORM[]
    transaction?: TransactionORM

    // exists on the database, but unused here. handled by backend
    // product_movement_details_temp: ProductMovementDetailORM[]
}
