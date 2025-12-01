import type EntryORM from './entry'
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
    description: string | null

    /**
     * [💾]
     */
    settings: {
        'accept-guest-entries'?: boolean
        'limit-per-participant'?: number | null
        closed?: boolean
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

    /** [🔗] */
    entries?: EntryORM[]
}
