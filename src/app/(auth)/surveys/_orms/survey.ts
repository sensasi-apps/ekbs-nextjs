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
    settings: {
        accept_guest_entries?: boolean
        limit_per_participant?: number
    } | null

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
