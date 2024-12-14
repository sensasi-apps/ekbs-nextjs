/**
 * @see https://datatables.net/manual/server-side#Sent-parameters
 */
interface DataTableRequest {
    draw: number
    start: number
    length: number
    search: {
        value: string | null
        regex: boolean
    }
    order: {
        column: number
        dir: string
    }[]
    columns: {
        data: string
        name: string
        searchable: boolean
        orderable: boolean
        search?: {
            value: string
            regex: boolean
        }
    }[]
}

export type { DataTableRequest }
