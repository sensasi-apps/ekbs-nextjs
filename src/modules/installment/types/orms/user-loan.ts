// vendor types
import type { UUID } from 'crypto'
// local types
import type { Ymd } from '@/types/date-string'
// orms
import type ActivityLogORM from '@/types/orms/activity-log'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
// modules
import type UserLoanResponseORM from '@/modules/installment/types/orms/user-loan-response'
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import type UserLoanStatusEnum from '@/modules/installment/enums/user-loan-status'
// auth modules
import type UserType from '@/modules/auth/types/orms/user'

export default interface UserLoanORM {
    uuid: UUID
    proposed_at: Ymd
    purpose: string
    proposed_rp: number
    interest_percent: number
    n_term: number
    term_unit: 'bulan' | 'minggu'
    note: string | null
    type: 'dana tunai' | 'kredit barang'
    user_uuid: UUID
    user: UserType
    activity_logs: ActivityLogORM[]

    status: UserLoanStatusEnum
    transaction?: TransactionORM
    is_approved?: boolean
    installments?: InstallmentORM[]
    responses?: UserLoanResponseORM[]
}
