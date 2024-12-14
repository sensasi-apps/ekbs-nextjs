/**
 * @see https://datatables.net/manual/server-side#Returned-data
 */
type YajraDatatable<T> = {
    draw: number
    recordsTotal: number
    recordsFiltered: number
    data: T[]
    error?: string
}

export default YajraDatatable
