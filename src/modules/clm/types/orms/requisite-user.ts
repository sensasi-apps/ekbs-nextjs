import type { UUID } from 'node:crypto'
import type User from '@/modules/user/types/orms/user'
import type FileORM from '@/types/orms/file'
//
import type RequisiteORM from './requisite'

export default interface RequisiteUserORM {
    uuid: UUID
    requisite_id: RequisiteORM['id']
    user_uuid: UUID
    approved_at: string
    approved_by_user_uuid: User['uuid']
    note: string

    // relations
    approved_by_user?: User
    files?: FileORM[]
    requisite?: RequisiteORM
}
