import type { UUID } from 'crypto'
import type ProductMovementDetailType from './ProductMovementDetail'
import type ActivityLogType from './ActivityLog'
import type ProductOpanameType from './ProductOpname'

type ProductMovementType = {
    uuid: UUID
    at: string
    type: ProductMovementTypeEnum
    note: string

    // relations
    details: ProductMovementDetailType[]
    user_activity_logs: ActivityLogType[]
}

export default ProductMovementType

export type ProductOpnameMovementType = ProductMovementType & {
    type: ProductMovementTypeEnum.OPNAME
    product_movementable: ProductOpanameType
}

enum ProductMovementTypeEnum {
    PURCHASE = 'pembelian',
    OPNAME = 'opname',
    GRANT = 'hibah',
    SELL = 'penjualan',
    RETURN = 'retur',
}
