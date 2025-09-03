import type ProductMovementORM from './product-movement'
import type ProductMovementSaleORM from './product-movement-sale'

export default interface ProductMovementWithSaleORM extends ProductMovementORM {
    sale: ProductMovementSaleORM
}
