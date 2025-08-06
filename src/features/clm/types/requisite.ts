export default interface Requisite {
    id: number
    name: string
    description: string | null
    type: 'user' | 'land'
    is_optional: boolean
}
