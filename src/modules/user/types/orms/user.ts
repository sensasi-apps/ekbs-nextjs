import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
// features
import type Employee from '@/modules/user/types/orms/employee'
import type UserSocial from '@/modules/user/types/orms/user-social'
import type Land from '@/modules/clm/types/orms/land'
import type File from '@/types/orms/file'

export default interface UserORM {
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
    detail?: {
        uuid: UUID
        user_uuid: UUID
        files?: File[]
    }
    member?: {
        uuid: UUID
        user_uuid: UUID
        joined_at: Ymd
        unjoined_at: Ymd | null
        unjoined_reason: string | null
        note: string | null
    }
    socials?: UserSocial[]
    last_six_months_tbs_performance?: []
    employee?: Employee | null
    phone_no?: string

    // lands
    lands?: Land[]
}
