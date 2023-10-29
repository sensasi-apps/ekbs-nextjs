import type { Moment } from 'moment'
import type { Dayjs } from 'dayjs'

export default function dmyToYmd(
    date: Moment | Dayjs | string | undefined,
): string | undefined {
    if (date === undefined) {
        return date
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

    return date.format('YYYY-MM-DD')
}
