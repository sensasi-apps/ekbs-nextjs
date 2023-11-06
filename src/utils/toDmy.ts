import type { Ymd } from '@/types/DateString'
import type { Dayjs } from 'dayjs'
import type { Moment } from 'moment'

export default function toDmy(date: Ymd | Moment | Dayjs): string {
    if (typeof date === 'string') {
        const [x, y, z] = date.split('-')

        if (x.length !== 4) {
            throw new Error('Invalid date format')
        }

        return `${z}-${y}-${x}`
    }

    return date.format('YYYY-MM-DD')
}
