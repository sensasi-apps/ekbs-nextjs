import type { UUID } from 'crypto'
import type UserType from './User'

export default interface ActivityLogType {
    uuid: UUID
    user_uuid: UUID
    action: 'created' | 'updated' | 'deleted'
    // model_classname: string,
    // model_uuid: UUID,
    // model_value_changed: any,
    at: string
    user: UserType
}
