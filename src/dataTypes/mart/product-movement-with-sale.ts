import type ProductMovement from './ProductMovement'
import type ProductMovementSale from './product-movement-sale'

export default interface ProductMovementWithSale extends ProductMovement {
    sale: ProductMovementSale
}
