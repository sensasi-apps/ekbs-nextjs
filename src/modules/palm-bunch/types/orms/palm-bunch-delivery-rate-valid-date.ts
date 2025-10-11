import type { Ymd } from '@/types/date-string'
import type PalmBunchDeliveryRateORM from './palm-bunch-delivery-rate'

export default interface PalmBunchDeliveryRateValidDateORM {
    id: number
    valid_from: Ymd
    valid_until: Ymd
    delivery_rates: PalmBunchDeliveryRateORM[]
}
