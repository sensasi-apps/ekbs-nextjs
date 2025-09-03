import type { UUID } from 'crypto'
import type { PalmBunchRateType } from './PalmBunchRate'
import type PalmBunchesReaPaymentDetail from '../types/orms/palm-bunch-rea-payment-detail'
import type PalmBunchesDelivery from '../types/orms/palm-bunches-delivery'
import type PalmBunchesReaGrading from '../types/orms/palm-bunches-rea-grading'
import type User from '../features/user/types/user'

export type PalmBunchesReaTicket = {
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
    rate?: PalmBunchRateType

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
