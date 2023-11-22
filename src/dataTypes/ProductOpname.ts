import type { Ymd } from '@/types/DateString'
import type { UUID } from 'crypto'
import type ProductMovementType from './ProductMovement'
import type ProductType from './Product'

type ProductOpanameType = {
    uuid: UUID
    at: Ymd
    note: string
    products_state: ProductType[]

    // relation
    product_movement: ProductMovementType
}

export default ProductOpanameType
