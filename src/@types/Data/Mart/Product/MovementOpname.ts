import Type from '@/dataTypes/enums/MartDB/ProductMovements/Type'
import ProductMovement from '@/dataTypes/mart/ProductMovement'

type ProductMovementOpname = ProductMovement & {
    type: Type.OPNAME
}

export default ProductMovementOpname
