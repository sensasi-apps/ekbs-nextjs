import { type UUID } from 'crypto'
import type User from './User'

interface UserLoanDBTableType {
    uuid: UUID
    user_loan_uuid: UUID
    by_user_uuid: UUID
    is_approved: boolean
}

interface InstallmentWithRelationType extends UserLoanDBTableType {
    by_user?: User
}

export type UserLoanResponse = UserLoanDBTableType | InstallmentWithRelationType
