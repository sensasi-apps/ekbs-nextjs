type PalmBunchRateType = {
    type: string
    rp_per_kg?: number
} & (
    | { id?: undefined; valid_date_id?: undefined }
    | { id: number; valid_date_id: number }
)

export default PalmBunchRateType
