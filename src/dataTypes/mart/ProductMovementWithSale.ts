import type ProductMovement from './ProductMovement'
import type ProductMovementSale from './ProductMovementSale'

type ProductMovementWithSale = ProductMovement & {
    sale: ProductMovementSale
}

export default ProductMovementWithSale
