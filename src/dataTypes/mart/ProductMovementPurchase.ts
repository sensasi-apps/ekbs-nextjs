import type { Ymd } from '@/types/DateString'

type ProductMovementPurchase = {
    received: Ymd
    paid: Ymd
}

export default ProductMovementPurchase
