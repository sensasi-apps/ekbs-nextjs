// vendor types
import type { UUID } from 'crypto'
// local types
import type { Installment } from './Installment'
import type { Transaction } from './Transaction'
import type UserType from './User'
import type ActivityLogType from './ActivityLog'
import type { Ymd } from '@/types/DateString'
import type { UserLoanResponse } from './UserLoanResponse'
import type UserLoanStatusEnum from './UserLoan/StatusEnum'

type NewLoanType = {
    status: UserLoanStatusEnum.WaitingForApproval
    transaction: null
    is_approved: null
    installments: []
    responses: []
}

type RejectedLoanType = {
    status: UserLoanStatusEnum.Rejected
    transaction: null
    is_approved: false
    installments: []
    responses: UserLoanResponse[]
}

type ApprovedLoanType = {
    status: UserLoanStatusEnum.WaitingForDisbursement
    transaction: null
    is_approved: true
    installments: []
    responses: UserLoanResponse[]
}

type ActiveLoanType = {
    status: UserLoanStatusEnum.Active
    transaction: Transaction
    is_approved: true
    installments: Installment[]
    responses: UserLoanResponse[]
}

type DoneLoanType = {
    status: UserLoanStatusEnum.Finished
    transaction: Transaction
    is_approved: true
    installments: Installment[]
    responses: UserLoanResponse[]
}

export type UserLoanType = {
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
    activity_logs: ActivityLogType[]
} & (
    | NewLoanType
    | RejectedLoanType
    | ApprovedLoanType
    | ActiveLoanType
    | DoneLoanType
)
