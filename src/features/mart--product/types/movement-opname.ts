import type Type from '@/dataTypes/enums/MartDB/ProductMovements/Type'
import type ProductMovement from '@/dataTypes/mart/ProductMovement'

export default interface ProductMovementOpname extends ProductMovement {
    type: Type.OPNAME
}
