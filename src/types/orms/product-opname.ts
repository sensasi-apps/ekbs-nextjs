import type { Ymd } from '@/types/DateString'
import type { UUID } from 'crypto'
import type ProductMovementORM from './product-movement'

export default interface ProductOpnameORM {
    uuid: UUID
    at: Ymd
    note: string

    // relation
    product_movement: ProductMovementORM
}
