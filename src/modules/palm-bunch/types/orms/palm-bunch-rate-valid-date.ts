import type { Ymd } from '@/types/date-string'
import type PalmBunchRateORM from './palm-bunch-rate'

export default interface PalmBunchRateValidDateORM {
    id?: number
    valid_from?: Ymd
    valid_until?: Ymd
    rates?: PalmBunchRateORM[]
}
