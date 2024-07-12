import Warehouse from '@/enums/Warehouse'

type ProductWarehouse = {
    id: number
    product_id: number
    warehouse: Warehouse
    qty: number
    default_sell_price: number
    base_cost_rp_per_unit: number
}

export default ProductWarehouse
