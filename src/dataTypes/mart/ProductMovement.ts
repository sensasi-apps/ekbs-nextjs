import type { UUID } from 'crypto'
import type Type from '../enums/MartDB/ProductMovements/Type'
import type Warehouse from '../enums/MartDB/ProductWarehouses/Warehouse'
import type Transaction from '../Transaction'
import type ProductMovementDetail from './ProductMovementDetail'
import type ProductMovementPurchase from './ProductMovementPurchase'
import type ProductMovementCost from './ProductMovementCost'
import type ProductMovementSale from './ProductMovementSale'
import type ActivityLogType from '../ActivityLog'

type ProductMovement = {
    uuid: UUID
    at: string
    type: Type
    warehouse: Warehouse
    note?: string

    // getter
    short_uuid: string

    // relations
    costs: ProductMovementCost[]
    details: ProductMovementDetail[]
    transaction?: Transaction
    purchase?: ProductMovementPurchase
    logs?: ActivityLogType[]
}

export default ProductMovement

export type ProductMovementWithSale = ProductMovement & {
    sale: ProductMovementSale
}
