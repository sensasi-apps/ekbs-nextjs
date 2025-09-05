import type Product from './product'
import type ProductWarehouseORM from './product-warehouse'

export default interface ProductMovementDetailORM {
    id: number
    product_id: number
    qty: number
    rp_per_unit: number
    rp_cost_per_unit: number
    product_state: Omit<Product, 'warehouses'>
    product_warehouse_state: ProductWarehouseORM

    // relations
    product?: Product
}
