import type { UUID } from 'crypto'
import type ProductMovementDetailType from './ProductMovementDetail'
import type ActivityLogType from './ActivityLog'
import type ProductOpnameType from './ProductOpname'

type ProductMovementType = {
    uuid: UUID
    at: string
    type: ProductMovementTypeEnum
    rp_cost: number

    // relations
    details: ProductMovementDetailType[]
    user_activity_logs: ActivityLogType[]
    costs: {
        name: string
        rp: number
    }[]
}

export default ProductMovementType

export type ProductOpnameMovementType = ProductMovementType & {
    type: ProductMovementTypeEnum.OPNAME
    product_movementable: ProductOpnameType
}

export enum ProductMovementTypeEnum {
    PURCHASE = 'pembelian',
    OPNAME = 'opname',
    // GRANT = 'hibah',
    SELL = 'penjualan',
    // RETURN = 'retur',
}
