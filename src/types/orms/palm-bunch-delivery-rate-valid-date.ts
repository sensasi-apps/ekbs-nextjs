import type { PalmBunchDeliveryRateType } from '../../dataTypes/PalmBunchDeliveryRate'
import type { Ymd } from '@/types/DateString'

export default interface PalmBunchDeliveryRateValidDateORM {
    id: number
    valid_from: Ymd
    valid_until: Ymd
    delivery_rates: PalmBunchDeliveryRateType[]
}
