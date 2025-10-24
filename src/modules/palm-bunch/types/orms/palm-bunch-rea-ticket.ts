import type { UUID } from 'node:crypto'
import type PalmBunchesReaPaymentDetail from '@/modules/palm-bunch/types/orms/palm-bunch-rea-payment-detail'
import type PalmBunchesDelivery from '@/modules/palm-bunch/types/orms/palm-bunches-delivery'
import type PalmBunchesReaGrading from '@/modules/palm-bunch/types/orms/palm-bunches-rea-grading'
import type User from '@/modules/user/types/orms/user'
import type PalmBunchRateORM from './palm-bunch-rate'

export default interface PalmBunchesReaTicketORM {
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
    rate?: PalmBunchRateORM

    validated_at: null | string
    validated_by_user_uuid: null | UUID
    validated_by_user?: User
}
