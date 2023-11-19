import type { UUID } from 'crypto'
import type ProductMovementDetailType from './ProductMovementDetail'
import type TransactionType from './Transaction'
import type { Ymd } from '@/types/DateString'
import type ProductMovementType from './ProductMovement'

type ProductPurchaseType = ProductPurchaseDBType | ProductPurchaseOrderedType
export default ProductPurchaseType

type ProductPurchaseDBType = {
    uuid: UUID
    order: Ymd
    due: Ymd | null
    paid: Ymd | null
    received: Ymd | null
    note: string | null
    // product_movement_details_temp: ProductMovementDetailType[] // on the database, but unused here. handled by backend
}

export type ProductPurchaseRelationsType = {
    product_movement: ProductMovementType
    product_movement_details: ProductMovementDetailType[]
    transaction: TransactionType
}

type ProductPurchaseOrderedType = {
    order: Ymd
} & ProductPurchaseDBType

// type ProductPurchasePaidType = {
//     paid: Ymd
// } & ProductPurchaseOrderedType

// type ProductPurchaseReceivedType = {
//     received: Ymd
// } & ProductPurchaseOrderedType
