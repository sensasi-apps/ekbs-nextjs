interface IdName {
    id: string
    name: string
}

export default interface Address {
    uuid: string
    province: IdName
    regency: IdName
    district?: IdName
    village?: IdName
    detail?: string
    zip_code?: string
}
