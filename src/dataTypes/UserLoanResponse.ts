import { UUID } from 'crypto'
import UserType from './User'

type UserLoanDBTableType = {
    uuid: UUID
    user_loan_uuid: UUID
    by_user_uuid: UUID
    is_approved: boolean
}

export type UserLoanRecordWithResponser = UserLoanDBTableType & {
    by_user: UserType
}

type UserLoanResponseType = UserLoanDBTableType | UserLoanRecordWithResponser

export default UserLoanResponseType
