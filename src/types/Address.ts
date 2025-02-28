export default interface Address {
    uuid: string
    regency: { id: string }
    district?: { id: string }
    village?: { id: string }
    detail?: string
    zip_code?: string
}
