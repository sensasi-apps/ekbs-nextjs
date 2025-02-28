import type { PalmBunchDeliveryRateType } from './PalmBunchDeliveryRate'
import type { Ymd } from '@/types/DateString'

export default interface PalmBunchDeliveryRateValidDateType {
    id: number
    valid_from: Ymd
    valid_until: Ymd
    delivery_rates: PalmBunchDeliveryRateType[]
}
