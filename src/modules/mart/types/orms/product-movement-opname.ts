import type Type from '@/modules/mart/enums/product-movement-type'
import type ProductMovementORM from '@/modules/mart/types/orms/product-movement'

export default interface ProductMovementOpnameORM extends ProductMovementORM {
    type: Type.OPNAME
}
