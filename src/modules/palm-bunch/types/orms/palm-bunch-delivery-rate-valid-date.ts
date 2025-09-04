import type PalmBunchDeliveryRateORM from './palm-bunch-delivery-rate'
import type { Ymd } from '@/types/date-string'

export default interface PalmBunchDeliveryRateValidDateORM {
    id: number
    valid_from: Ymd
    valid_until: Ymd
    delivery_rates: PalmBunchDeliveryRateORM[]
}
