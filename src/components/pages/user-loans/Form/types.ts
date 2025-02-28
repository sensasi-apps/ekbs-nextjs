import type CashType from '@/dataTypes/Cash'
import type { UserLoanType } from '@/dataTypes/Loan'

/**
 * Represents the data type for the user loan form.
 */
export type UserLoanFormDataType = {
    user_uuid: UserLoanType['user_uuid'] | ''
    proposed_rp: UserLoanType['proposed_rp'] | ''
    n_term: UserLoanType['n_term'] | ''
    term_unit: UserLoanType['term_unit']
    purpose: UserLoanType['purpose'] | ''
    proposed_at: UserLoanType['proposed_at'] | null
    interest_percent: UserLoanType['interest_percent'] | ''
    type: UserLoanType['type'] | ''
    cashable_uuid: CashType['uuid'] | ''
}
