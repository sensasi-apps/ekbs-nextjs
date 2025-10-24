import type { UUID } from 'node:crypto'
import type PalmBunchesReaPaymentDetail from '@/modules/palm-bunch/types/orms/palm-bunch-rea-payment-detail'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type { Ymd } from '@/types/date-string'
import type FileType from '@/types/orms/file'

export default interface PalmBunchesReaPaymentDataORM {
    uuid: UUID
    from_at: Ymd
    to_at: Ymd
    gross_rp: number
    deduction_rp: number
    incentive_rp: number
    net_rp: number
    excel_file: FileType
    transaction_drafts: TransactionORM[]
    transactions: TransactionORM[]
    details: PalmBunchesReaPaymentDetail[]

    n_tickets?: number
    n_details_not_found_on_system?: number
    n_details_unvalidated?: number
    n_details_unsynced?: number
    n_details_has_paid?: number
}
