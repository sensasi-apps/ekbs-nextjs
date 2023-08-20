import { Moment } from 'moment'
import PalmBunchDeliveryRateType from './PalmBunchDeliveryRate.type'

type PalmBunchDeliveryRateValidDateType = {
    id?: number
    valid_from?: string | Moment
    valid_until?: string | Moment
    delivery_rates?: PalmBunchDeliveryRateType[]
}

export default PalmBunchDeliveryRateValidDateType
