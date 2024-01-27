import type { Ymd } from '@/types/DateString'
import type { UUID } from 'crypto'
import type ProductMovementType from './ProductMovement'

type ProductOpnameType = {
    uuid: UUID
    at: Ymd
    note: string

    // relation
    product_movement: ProductMovementType
}

export default ProductOpnameType
