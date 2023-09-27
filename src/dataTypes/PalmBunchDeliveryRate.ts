type PalmBunchDeliveryRateType = {
    to_oil_mill_code: string
    from_position: string
    rp_per_kg: number
} & (
    | { id?: undefined; valid_date_id?: undefined }
    | { id: number; valid_date_id: number }
)

export default PalmBunchDeliveryRateType
