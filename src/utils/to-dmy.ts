import type { Ymd } from '@/types/date-string'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export default function toDmy(date: Ymd | Dayjs | string): string {
    if (typeof date === 'string') {
        return dayjs(date).format('DD-MM-YYYY')
    }

    return date.format('DD-MM-YYYY')
}
