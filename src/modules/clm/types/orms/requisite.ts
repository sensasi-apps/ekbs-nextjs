export default interface RequisiteORM {
    id: number
    name: string
    description: string | null
    type: 'user' | 'land'
    is_optional: boolean

    // relations
    certifications?: {
        id: number
        name: string
    }[]
}
