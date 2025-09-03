import type ProductMovementCost from '@/dataTypes/mart/ProductMovementCost'
import type ProductMovementDetail from '@/dataTypes/mart/ProductMovementDetail'
import type ProductMovementSale from '@/dataTypes/mart/product-movement-sale'
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
import type CashType from '@/types/orms/cash'

export interface FormValuesType {
    at?: ProductMovement['at']
    paid?: ProductMovement['at']
    cashable_uuid?: CashType['uuid']
    cashable_name?: CashType['name']
    buyer_user_uuid?: ProductMovementSale['buyer_user_uuid']
    buyer_user?: ProductMovementSale['buyer_user']
    total_payment?: ProductMovementSale['total_payment']
    details: {
        product: ProductMovementDetail['product']
        product_id: ProductMovementDetail['product_id']
        qty: ProductMovementDetail['qty']
        rp_per_unit: ProductMovementDetail['rp_per_unit']
    }[]
    costs: {
        name: ProductMovementCost['name']
        rp?: ProductMovementCost['rp']
    }[]
}
