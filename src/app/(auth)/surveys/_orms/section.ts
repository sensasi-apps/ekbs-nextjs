import type QuestionORM from './question'
import type SurveyORM from './survey'

export default interface SectionORM {
    /** [💾] */
    readonly id: number

    /** [💾] */
    survey_id: number | null

    /** [💾] */
    name: string

    /** [💾] */
    order: number

    /** [💾] */
    created_at: string

    /** [💾] */
    updated_at: string

    /** [🔗] */
    survey?: SurveyORM | null

    /** [🔗] */
    questions?: QuestionORM[]
}
