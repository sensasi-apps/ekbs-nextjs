import type AnswerORM from './answer'
import type SectionORM from './section'
import type SurveyORM from './survey'

export default interface QuestionORM {
    /** [💾] */
    readonly id: number

    /** [💾] */
    survey_id: number | null

    /** [💾] */
    section_id: number | null

    /** [💾] */
    content: string

    /** [💾] */
    type: 'text' | 'number' | 'radio' | 'multiselect'

    /**
     * [💾] available options as the answer
     */
    options: string[] | null

    /**
     * [💾] laravel validation rules for the answer per question
     */
    rules: string[] | null

    /** [💾] */
    order: number

    /** [💾] */
    created_at: string

    /** [💾] */
    updated_at: string

    /** [🔗] */
    section?: SectionORM

    /** [🔗] */
    survey?: SurveyORM

    /** [🔗] */
    answers?: AnswerORM[]
}
