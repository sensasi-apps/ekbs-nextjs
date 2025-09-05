import type PalmBunchRateORM from './palm-bunch-rate'
import type { Ymd } from '@/types/date-string'

export default interface PalmBunchRateValidDateORM {
    id?: number
    valid_from?: Ymd
    valid_until?: Ymd
    rates?: PalmBunchRateORM[]
}
