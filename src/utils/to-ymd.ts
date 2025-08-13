import type { Ymd } from '@/types/DateString'
import type { Dayjs } from 'dayjs'

export function toYmd(date: Dayjs): Ymd {
    return date.format('YYYY-MM-DD') as Ymd
}
