import type ProductMovement from './ProductMovement'
import type ProductMovementSale from './product-movement-sale'

type ProductMovementWithSale = ProductMovement & {
    sale: ProductMovementSale
}

export default ProductMovementWithSale
