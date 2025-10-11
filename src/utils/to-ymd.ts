import type { Dayjs } from 'dayjs'
import type { Ymd } from '@/types/date-string'

export function toYmd(date: Dayjs): Ymd {
    return date.format('YYYY-MM-DD') as Ymd
}
