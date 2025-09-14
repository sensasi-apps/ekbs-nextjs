export default interface ServiceORM {
    id: number
    name: string
    default_price: number

    created_at: string
    updated_at?: string
    deleted_at?: string
}
