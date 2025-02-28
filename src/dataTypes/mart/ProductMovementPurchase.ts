import type { Ymd } from '@/types/DateString'

export default interface ProductMovementPurchase {
    received: Ymd
    paid: Ymd
}
