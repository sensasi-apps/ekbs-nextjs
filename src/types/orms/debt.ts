import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type BusinessUnit from './business-unit'
import type InterestUnit from '../../dataTypes/enums/DbColumns/Debts/InterestUnit'
import type TermUnit from '../../dataTypes/enums/DbColumns/Debts/TermUnit'
import type DebtDetail from './debt-detail'

export default interface DebtORM {
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
