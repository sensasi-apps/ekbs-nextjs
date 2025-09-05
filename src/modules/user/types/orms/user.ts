import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
// features
import type Employee from '@/modules/user/types/orms/employee'
import type UserSocial from '@/modules/user/types/orms/user-social'
import type Land from '@/modules/clm/types/orms/land'
import type UserDetailORM from './user-detail'
import type UserAddressORM from './user-address'
import type UserBankAccountORM from './user-bank-account'
import type VehicleORM from '@/types/orms/vehicle'

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
    addresses?: UserAddressORM[]
    bankAccs?: UserBankAccountORM[]
    detail?: UserDetailORM
    driver?: {
        uuid: string
        user_uuid: string
        license_number: string
    }
    drivers?: UserORM[]
    employee?: Employee | null
    lands?: Land[]
    last_six_months_tbs_performance?: []
    member?: {
        uuid: UUID
        user_uuid: UUID
        joined_at: Ymd
        unjoined_at: Ymd | null
        unjoined_reason: string | null
        note: string | null
    }
    phone_no?: string
    socials?: UserSocial[]
    vehicles?: VehicleORM[]
}
