import type { UUID } from 'node:crypto'
// modules
import type LandORM from '@/modules/clm/types/orms/land'
import type RequisiteORM from '@/modules/clm/types/orms/requisite'
import type User from '@/modules/user/types/orms/user'
import type FileORM from '@/types/orms/file'

export default interface RequisiteLandORM {
    uuid: UUID
    requisite_id: RequisiteORM['id']
    land_uuid: LandORM['uuid']
    approved_at: string
    approved_by_user_uuid: User['uuid']
    note: string

    // relations
    approved_by_user?: User
    files?: FileORM[]
    requisite?: RequisiteORM
}
