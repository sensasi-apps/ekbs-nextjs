import { type UUID } from 'crypto'
import type User from '@/modules/auth/types/orms/user'

export default interface UserLoanResponse {
    uuid: UUID
    user_loan_uuid: UUID
    by_user_uuid: UUID
    is_approved: boolean

    // relations
    by_user?: User
}
