import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type Type from '../enums/MartDB/ProductMovements/Type'
import type Warehouse from '../enums/MartDB/ProductWarehouses/Warehouse'
import type Transaction from '../Transaction'
import type ProductMovementDetail from './ProductMovementDetail'
import type ProductMovementPurchase from './ProductMovementPurchase'
import type ProductMovementCost from './ProductMovementCost'

type ProductMovement = {
    uuid: UUID
    at: Ymd
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
}

export default ProductMovement
