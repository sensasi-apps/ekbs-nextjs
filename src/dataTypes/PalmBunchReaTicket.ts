import PalmBunchesDeliveryDataType from './PalmBunchesDelivery'
import PalmBunchesReaGradingDataType from './PalmBunchesReaGrading'

type PalmBunchesReaTicketDataType = {
    id: number
    at: string
    spb_no: string
    ticket_no: string
    gradis_no: string
    vebewe_no: string
    rp_per_kg: number
    wb_ticket_no: string

    as_farmer_id: string
    as_farmer_name: string
    as_farm_land_id: string

    delivery: PalmBunchesDeliveryDataType
    gradings: PalmBunchesReaGradingDataType[]
}

export default PalmBunchesReaTicketDataType
