export default interface Service {
    id: number
    name: string
    default_rp: number

    created_at: string
    updated_at?: string
    deleted_at?: string
}
