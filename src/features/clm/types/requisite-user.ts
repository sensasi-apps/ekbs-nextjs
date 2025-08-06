import type { UUID } from 'crypto'
import type Requisite from './requisite'
import type User from '@/features/user/types/user'

export default interface RequisiteUser {
    uuid: UUID
    requisite_id: Requisite['id']
    user_uuid: UUID
    approved_at: string
    approved_by_user_uuid: User['uuid']
    note: string

    // relations
    approved_by_user?: User
    files?: File[]
    requisite?: Requisite
}
