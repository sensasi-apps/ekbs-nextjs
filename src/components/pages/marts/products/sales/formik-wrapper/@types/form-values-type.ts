import type ProductMovement from '@/modules/mart/types/orms/product-movement'
import type ProductMovementCost from '@/modules/mart/types/orms/product-movement-cost'
import type ProductMovementDetail from '@/modules/mart/types/orms/product-movement-detail'
import type ProductMovementSale from '@/modules/mart/types/orms/product-movement-sale'
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
