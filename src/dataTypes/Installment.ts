import type { UUID } from 'crypto'
import type TransactionType from './Transaction'
import type { Ymd } from '@/types/DateString'
import type UserLoanType from './Loan'
import type { CashableClassname } from './Transaction'

type InstallmentDBTableType = {
    uuid: UUID
    should_be_paid_at: Ymd
    amount_rp: number
    penalty_rp: number
    n_th: number

    // table_column but practically unused
    // installmentable_classname: string
    // installmentable_uuid: UUID
}

export type InstallmentUserLoanType = InstallmentDBTableType & {
    installmentable: UserLoanType
}

export type InstallmentWithTransactionType = InstallmentDBTableType & {
    transaction?: TransactionType
    transaction_cashable_classname?: CashableClassname
}

type InstallmentType = InstallmentDBTableType | InstallmentUserLoanType

export default InstallmentType
