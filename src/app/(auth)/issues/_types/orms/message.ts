import type UserORM from '@/modules/user/types/orms/user'
import type TicketORM from './ticket'

export default interface MessageORM {
    /** [💾] */
    readonly id: number

    /** [💾] */
    by_user_uuid: string

    /** [💾] */
    ticket_id: number

    /** [💾] */
    message: string

    /** [💾] */
    created_at: string

    /** [💾] */
    updated_at: string

    /** [🔗] */
    ticket: TicketORM

    /** [🔗] */
    user: UserORM
}
