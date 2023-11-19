import type PalmBunchDeliveryRateType from './PalmBunchDeliveryRate'
import type { Ymd } from '@/types/DateString'

type PalmBunchDeliveryRateValidDateType = {
    id: number
    valid_from: Ymd
    valid_until: Ymd
    delivery_rates: PalmBunchDeliveryRateType[]
}

export default PalmBunchDeliveryRateValidDateType
