import type UserORM from '@/modules/user/types/orms/user'
import type SurveyORM from './survey'

export default interface EntryORM {
    /** [💾] */
    readonly id: number

    /** [💾] */
    survey_id: number

    /** [💾] */
    participant_id: number | null

    /** [💾] */
    created_at: string

    /** [💾] */
    updated_at: string

    /** [🔗] */
    survey?: SurveyORM

    /** [🔗] */
    participant?: UserORM | null
}
