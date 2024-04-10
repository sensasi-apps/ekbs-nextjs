import type { UUID } from 'crypto'
import type PalmBunchRate from './PalmBunchRate'
import type PalmBunchesReaPaymentDetail from './PalmBunchReaPaymentDetail'
import type PalmBunchesDelivery from './PalmBunchesDelivery'
import type PalmBunchesReaGrading from './PalmBunchesReaGrading'
import type User from './User'

type PalmBunchesReaTicket = {
    id: number
    at: string
    spb_no?: string
    ticket_no: string
    gradis_no: string
    vebewe_no: string
    wb_ticket_no: string

    as_farmer_id: string
    as_farmer_name: string
    as_farm_land_id?: string

    delivery: PalmBunchesDelivery
    gradings: PalmBunchesReaGrading[]
    payment_detail?: PalmBunchesReaPaymentDetail
    rate?: PalmBunchRate

    validated_at: null | string
    validated_by_user_uuid: null | UUID
    validated_by_user?: User
} & (
    | {
          validated_at: null
          validated_by_user_uuid: null
          validated_by_user: undefined
      }
    | {
          validated_at: string
          validated_by_user_uuid: UUID
          validated_by_user?: User
      }
)

export default PalmBunchesReaTicket
