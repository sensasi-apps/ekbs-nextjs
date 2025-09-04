import type { UUID } from 'crypto'
import type Type from '../../enums/product-movement-type'
import type Warehouse from '../../enums/product-warehouse-warehouse'
import type { Transaction } from '../../../../dataTypes/Transaction'
import type ProductMovementDetail from './product-movement-detail'
import type ProductMovementPurchase from './product-movement-purchase'
import type ProductMovementCost from './product-movement-cost'
import type User from '@/modules/auth/types/orms/user'

export default interface ProductMovementORM {
    uuid: UUID
    at: string
    type: Type
    warehouse: Warehouse
    note: string | null
    by_user_uuid: UUID
    finished_at: string | null

    // getter
    short_uuid: string

    // relations
    costs: ProductMovementCost[]
    details: ProductMovementDetail[]
    transaction?: Transaction
    purchase?: ProductMovementPurchase
    by_user?: User
}
