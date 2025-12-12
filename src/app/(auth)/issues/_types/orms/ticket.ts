import type UserORM from '@/modules/user/types/orms/user'
import type MessageORM from './message'

export default interface TicketORM {
    /** [💾] */
    readonly id: number

    /** [💾] */
    readonly uuid: string

    /** [💾] */
    by_user_uuid: UserORM['uuid']

    /** [💾] */
    title: string

    /** [💾] */
    message: string

    /** [💾] */
    priority: 'low' | 'medium' | 'high'

    /** [💾] */
    status: 'open' | 'closed'

    /** [💾] */
    is_resolved: boolean

    /** [💾] */
    is_locked: boolean

    /** [💾] */
    assigned_to_user_uuid: UserORM['uuid'] | null

    /** [💾] */
    created_at: string

    /** [💾] */
    updated_at: string

    /** [🔗] */
    user: UserORM | null

    /** [🔗] */
    messages?: MessageORM[]
}
