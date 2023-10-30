import type { Moment } from 'moment'
import type { Dayjs } from 'dayjs'

export default function ymdToDmy(
    date: Moment | Dayjs | string | undefined | null,
): string | undefined {
    if (date === undefined || date === null) {
        return undefined
    }

    if (typeof date === 'string') {
        if (date.length === 0) {
            return ''
        }

        const parts = date.split('-')

        if (parts.length !== 3) {
            throw new Error('Invalid date format')
        }

        const [day, month, year] = parts

        return `${year}-${month}-${day}`
    }

    return date.format('DD-MM-YYYY')
}
