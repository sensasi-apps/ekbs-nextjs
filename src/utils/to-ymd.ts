import type { Ymd } from '@/types/date-string'
import type { Dayjs } from 'dayjs'

export function toYmd(date: Dayjs): Ymd {
    return date.format('YYYY-MM-DD') as Ymd
}
