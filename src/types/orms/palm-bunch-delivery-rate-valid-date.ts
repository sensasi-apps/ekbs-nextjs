import type { PalmBunchDeliveryRateType } from '../../dataTypes/PalmBunchDeliveryRate'
import type { Ymd } from '@/types/date-string'

export default interface PalmBunchDeliveryRateValidDateORM {
    id: number
    valid_from: Ymd
    valid_until: Ymd
    delivery_rates: PalmBunchDeliveryRateType[]
}
