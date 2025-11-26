import type SectionORM from './section'

export default interface SurveyORM {
    /**
     * [💾]
     */
    readonly id: number

    /**
     * [💾]
     */
    name: string

    /**
     * [💾]
     */
    settings: unknown | null

    /**
     * [💾]
     */
    created_at: string

    /**
     * [💾]
     */
    updated_at: string

    /** [🔗] */
    sections?: SectionORM[]
}
