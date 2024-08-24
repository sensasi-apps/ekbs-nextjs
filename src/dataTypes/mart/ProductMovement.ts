import type { UUID } from 'crypto'
import type Type from '../enums/MartDB/ProductMovements/Type'
import type Warehouse from '../enums/MartDB/ProductWarehouses/Warehouse'
import type Transaction from '../Transaction'
import type ProductMovementDetail from './ProductMovementDetail'
import type ProductMovementPurchase from './ProductMovementPurchase'
import type ProductMovementCost from './ProductMovementCost'
import type User from '../User'

type ProductMovement = {
    uuid: UUID
    at: string
    type: Type
    warehouse: Warehouse
    note: string | null
    by_user_uuid: UUID

    // getter
    short_uuid: string

    // relations
    costs: ProductMovementCost[]
    details: ProductMovementDetail[]
    transaction?: Transaction
    purchase?: ProductMovementPurchase
    by_user?: User
}

export default ProductMovement
