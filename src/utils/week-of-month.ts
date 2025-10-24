import dayjs, { type Dayjs } from 'dayjs'
import type { Ymd } from '@/types/date-string'

/**
 * Returns the week of the month for a given date.
 * @param date - The date to calculate the week of the month for.
 * @returns The week of the month for the given date.
 */
export default function weekOfMonth(date: Ymd | Dayjs) {
    let dateDayJs: Dayjs | Ymd

    if (typeof date === 'string') dateDayJs = dayjs(date, 'YYYY-MM-DD')
    else dateDayJs = date

    const startOfMonth = dateDayJs.clone().startOf('month')
    const weekOfMonth = dateDayJs.diff(startOfMonth, 'weeks') + 1

    return weekOfMonth
}
