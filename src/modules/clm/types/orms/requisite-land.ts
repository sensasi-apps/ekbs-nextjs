import type { UUID } from 'crypto'
import type User from '@/features/user/types/user'
//
import type LandORM from './land'
import type RequisiteORM from './requisite'

export default interface RequisiteLandORM {
    uuid: UUID
    requisite_id: RequisiteORM['id']
    land_uuid: LandORM['uuid']
    approved_at: string
    approved_by_user_uuid: User['uuid']
    note: string

    // relations
    approved_by_user?: User
    files?: File[]
}
