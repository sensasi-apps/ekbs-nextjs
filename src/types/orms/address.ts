interface IdName {
    id: number
    name: string
}

export default interface AddressORM {
    uuid: string
    province: IdName
    regency: IdName
    district?: IdName
    village?: IdName
    detail?: string
    zip_code?: string

    // accessors

    /**
     * It should be the `province`, `regency`, `district`, or `village`
     */
    region: IdName
}
