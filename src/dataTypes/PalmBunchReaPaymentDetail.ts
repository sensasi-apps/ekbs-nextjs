import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'

type PalmBunchesReaPaymentDetail = {
    palm_bunches_rea_payment_uuid: UUID
    weighting_at: Ymd
    oil_mill_code: string
    ticket_no: string
    wb_ticket_no: string
    vehicle_no: string
    farmer_name: string
    gross_bunches: number
    gross_kg: number
    deduction_kg: number
    incentive_kg: number
    net_kg: number
    price_rp: number
    gross_rp: number
    deduction_rp: number
    incentive_rp: number
    net_rp: number
}

export default PalmBunchesReaPaymentDetail
