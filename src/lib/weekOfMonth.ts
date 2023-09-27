import type { MomentInput } from 'moment'
import moment from 'moment'

/**
 * Returns the week of the month for a given date.
 * @param date - The date to calculate the week of the month for.
 * @returns The week of the month for the given date.
 */
const weekOfMonth = (date: MomentInput) => {
    const momentDate = moment(date)

    const startOfMonth = momentDate.clone().startOf('month')
    const weekOfMonth = momentDate.diff(startOfMonth, 'weeks') + 1

    return weekOfMonth
}

export default weekOfMonth
