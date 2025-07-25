/**
 * @see https://datatables.net/manual/server-side#Returned-data
 */
export interface YajraDatatable<T> {
    draw: number
    recordsTotal: number
    recordsFiltered: number
    data: T[]
    error?: string
}
