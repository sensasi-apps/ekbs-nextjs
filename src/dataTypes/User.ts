import type { Employee } from '@/@types/Data/Employee'
import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type { Installment } from './Installment'

export default interface User {
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
