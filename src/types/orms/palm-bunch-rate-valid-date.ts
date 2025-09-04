import type { PalmBunchRateType } from '../../dataTypes/PalmBunchRate'
import type { Ymd } from '@/types/date-string'

export default interface PalmBunchRateValidDateORM {
    id?: number
    valid_from?: Ymd
    valid_until?: Ymd
    rates?: PalmBunchRateType[]
}
