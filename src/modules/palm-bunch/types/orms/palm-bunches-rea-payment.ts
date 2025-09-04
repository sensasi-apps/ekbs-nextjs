import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type FileType from '../../../../types/orms/file'
import type { Transaction } from '../../../../dataTypes/Transaction'
import type PalmBunchesReaPaymentDetail from './palm-bunch-rea-payment-detail'

export default interface PalmBunchesReaPaymentDataORM {
    uuid: UUID
    from_at: Ymd
    to_at: Ymd
    gross_rp: number
    deduction_rp: number
    incentive_rp: number
    net_rp: number
    excel_file: FileType
    transaction_drafts: Transaction[]
    transactions: Transaction[]
    details: PalmBunchesReaPaymentDetail[]

    n_tickets?: number
    n_details_not_found_on_system?: number
    n_details_unvalidated?: number
    n_details_unsynced?: number
    n_details_has_paid?: number
}
