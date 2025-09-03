import type { UUID } from 'crypto'
import type UserType from '@/features/user/types/user'

export default interface PayrollUserORM {
    uuid: UUID
    payroll_uuid: UUID
    user_uuid: string
    user_state: UserType
    note?: string
    final_rp_cache: number

    // relations
    // user?: UserType
    details?: PayrollUserDetail[]
}

type PayrollUserDetail = {
    uuid: UUID
    seq_no: number
    name: string
    amount_rp: number
    payroll_user_detailable_id: UUID | null
}
