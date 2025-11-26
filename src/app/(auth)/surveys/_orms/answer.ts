import type EntryORM from './entry'
import type QuestionORM from './question'

export default interface AnswerORM {
    /** [💾] */
    readonly id: string

    /** [💾] */
    question_id: number

    /** [💾] */
    entry_id: number | null

    /** [💾] */
    text: string

    /** [💾] */
    created_at: string

    /** [💾] */
    updated_at: string

    /** [🔗] */
    question?: QuestionORM

    /** [🔗] */
    entry?: EntryORM | null
}
