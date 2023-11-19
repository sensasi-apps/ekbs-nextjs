import type PalmBunchRateType from './PalmBunchRate'
import type { Ymd } from '@/types/DateString'

type PalmBunchRateValidDateType = {
    id?: number
    valid_from?: Ymd
    valid_until?: Ymd
    rates?: PalmBunchRateType[]
}

export default PalmBunchRateValidDateType
