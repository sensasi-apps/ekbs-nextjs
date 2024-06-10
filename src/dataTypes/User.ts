import type { Ymd } from '@/types/DateString'
import type { UUID } from 'crypto'
import Installment from './Installment'

interface UserType {
    id: number
    is_active: boolean
    is_agreed_tncp: boolean
    nickname: string
    role_names: string[]
    role_names_id: string[]
    permission_names: string[]
    name: string
    email: string
    uuid: UUID

    // relations
    member?: {
        uuid: UUID
        user_uuid: UUID
        joined_at: Ymd
        unjoined_at: Ymd | null
        unjoined_reason: string | null
        note: string | null
    }
    socials?: []
    last_six_months_tbs_performance?: []
    employee?: Employee | null
    phone_no?: string

    unpaid_installments?: Installment[] // only used in \src\components\Wallet\TxForm.tsx
}

export default UserType

enum EmployeeStatusId {
    MAGANG = 1,
    KONTRAK = 2,
    TETAP = 3,
    PENGURUS = 4,
}

type Employee = {
    employee_status_id: EmployeeStatusId
    joined_at: Ymd
    unjoined_at: Ymd | null
    unjoined_reason: string | null
    position: string
    note: string | null

    // relations
    employee_status?: {
        id: EmployeeStatusId
        name: string
    }
}
