import type { UUID } from 'crypto'
import Warehouse from '@/modules/farm-inputs/enums/warehouse'
import type ActivityLog from '@/types/orms/activity-log'
import type ProductMovementDetail from './product-movement-detail'

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

enum ProductMovementTypeEnum {
    PURCHASE = 'pembelian',
    OPNAME = 'opname',
    // GRANT = 'hibah',
    SELL = 'penjualan',
    // RETURN = 'retur',
}
