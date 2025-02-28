import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type BusinessUnit from './BusinessUnit'
import type InterestUnit from './enums/DbColumns/Debts/InterestUnit'
import type TermUnit from './enums/DbColumns/Debts/TermUnit'
import type DebtDetail from './DebtDetail'

export default interface Debt {
    uuid: UUID
    business_unit_id: number | null
    at: Ymd
    term: number
    term_unit: TermUnit
    interest: number
    interest_unit: InterestUnit
    base_rp: number
    note: null | string

    // relations
    business_unit: BusinessUnit
    details: DebtDetail[]

    // accessors
    hasDetails?: boolean
}
