import type Type from '@/dataTypes/enums/MartDB/ProductMovements/Type'
import type ProductMovement from '@/modules/mart/types/orms/product-movement'

export default interface ProductMovementOpname extends ProductMovement {
    type: Type.OPNAME
}
