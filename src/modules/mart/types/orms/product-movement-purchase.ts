import type { Ymd } from '@/types/date-string'

export default interface ProductMovementPurchaseORM {
    received: Ymd
    paid: Ymd
}
