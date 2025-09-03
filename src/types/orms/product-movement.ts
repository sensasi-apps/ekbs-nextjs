import type { UUID } from 'crypto'
import type ProductMovementDetail from './product-movement-detail'
import type ActivityLog from './activity-log'
import type ProductOpname from './product-opname'
import Warehouse from '@/enums/Warehouse'

export default interface ProductMovementORM {
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

export type ProductOpnameMovementType = ProductMovementORM & {
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
