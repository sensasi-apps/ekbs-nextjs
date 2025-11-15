/**
 * @see https://datatables.net/manual/server-side#Returned-data
 */
export default interface YajraDataTableResponse<T> {
    draw: number
    recordsTotal: number
    recordsFiltered: number
    data: T[]
    error?: string
}
