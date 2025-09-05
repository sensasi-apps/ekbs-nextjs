import type CashType from '@/types/orms/cash'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'

/**
 * Represents the data type for the user loan form.
 */
export type UserLoanFormDataType = {
    user_uuid: UserLoanORM['user_uuid'] | ''
    proposed_rp: UserLoanORM['proposed_rp'] | ''
    n_term: UserLoanORM['n_term'] | ''
    term_unit: UserLoanORM['term_unit']
    purpose: UserLoanORM['purpose'] | ''
    proposed_at: UserLoanORM['proposed_at'] | null
    interest_percent: UserLoanORM['interest_percent'] | ''
    type: UserLoanORM['type'] | ''
    cashable_uuid: CashType['uuid'] | ''
}
