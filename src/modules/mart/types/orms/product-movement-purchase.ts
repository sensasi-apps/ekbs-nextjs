import type { Ymd } from '@/types/DateString'

export default interface ProductMovementPurchaseORM {
    received: Ymd
    paid: Ymd
}
