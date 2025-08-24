import type { UUID } from 'crypto'
import type Requisite from './requisite'
import type User from '@/features/user/types/user'
import type Land from '@/modules/clm/types/orms/land'

export default interface RequisiteLand {
    uuid: UUID
    requisite_id: Requisite['id']
    land_uuid: Land['uuid']
    approved_at: string
    approved_by_user_uuid: User['uuid']
    note: string

    // relations
    approved_by_user?: User
    files?: File[]
}
