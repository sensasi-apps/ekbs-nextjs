type YajraDatatable<T = unknown> = {
    draw: number
    recordsTotal: number
    recordsFiltered: number
    data: T[]
    error?: string
}

export default YajraDatatable
