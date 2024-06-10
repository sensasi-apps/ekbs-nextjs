type Role = {
    id: number
    name: string
    name_id: string
    group: string
    permissions: {
        name: string
        guard_name: string
        created_at: string
        updated_at: string
    }[]
}

export default Role
