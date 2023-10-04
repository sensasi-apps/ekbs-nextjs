import { Moment } from 'moment'
import PalmBunchRateType from './PalmBunchRate'

type PalmBunchRateValidDateType = {
    id?: number
    valid_from?: string | Moment
    valid_until?: string | Moment
    rates?: PalmBunchRateType[]
}

export default PalmBunchRateValidDateType
