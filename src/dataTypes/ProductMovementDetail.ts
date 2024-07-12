import type Product from './Product'
import type ProductWarehouse from './ProductWarehouse'

type ProductMovementDetail = {
    id: number
    product_id: number
    qty: number
    rp_per_unit: number
    rp_cost_per_unit: number
    product_state: Omit<Product, 'warehouses'>
    product_warehouse_state: ProductWarehouse

    // relations
    product?: Product
}

export default ProductMovementDetail
