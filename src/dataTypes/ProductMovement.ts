import type { UUID } from 'crypto'
import type ProductMovementDetail from './ProductMovementDetail'
import type ActivityLog from './ActivityLog'
import type ProductOpname from './ProductOpname'
import Warehouse from '@/enums/Warehouse'

export default interface ProductMovement {
    uuid: UUID
    at: string
    type: ProductMovementTypeEnum
    rp_cost: number
    warehouse: Warehouse

    // relations
    details: ProductMovementDetail[]
    user_activity_logs: ActivityLog[]
    costs: {
        name: string
        rp: number
    }[]
}

export type ProductOpnameMovementType = ProductMovement & {
    type: ProductMovementTypeEnum.OPNAME
    product_movementable: ProductOpname
}

export enum ProductMovementTypeEnum {
    PURCHASE = 'pembelian',
    OPNAME = 'opname',
    // GRANT = 'hibah',
    SELL = 'penjualan',
    // RETURN = 'retur',
}
