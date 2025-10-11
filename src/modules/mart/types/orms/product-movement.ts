import type { UUID } from 'crypto'
// mart
import type Type from '@/modules/mart/enums/product-movement-type'
import type Warehouse from '@/modules/mart/enums/product-warehouse-warehouse'
import type ProductMovementCostORM from '@/modules/mart/types/orms/product-movement-cost'
import type ProductMovementDetailORM from '@/modules/mart/types/orms/product-movement-detail'
import type ProductMovementPurchaseORM from '@/modules/mart/types/orms/product-movement-purchase'
//
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
//
import type UserORM from '@/modules/user/types/orms/user'

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
    costs: ProductMovementCostORM[]
    details: ProductMovementDetailORM[]
    transaction?: TransactionORM
    purchase?: ProductMovementPurchaseORM
    by_user?: UserORM
}
