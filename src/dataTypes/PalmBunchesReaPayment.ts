import type { UUID } from 'crypto'
import type TransactionDataType from './Transaction'
import type FileType from './File'
import type { Ymd } from '@/types/DateString'

type PalmBunchesReaPaymentDataType = {
    uuid: UUID
    from_at: Ymd
    to_at: Ymd
    n_tickets: number
    n_details_has_paid: number
    n_details_incorrect: number
    n_details_not_found_on_system: number
    gross_rp: number
    deduction_rp: number
    incentive_rp: number
    net_rp: number
    excel_file: FileType
    transaction_drafts: TransactionDataType[]
    transactions: TransactionDataType[]
}

export default PalmBunchesReaPaymentDataType
