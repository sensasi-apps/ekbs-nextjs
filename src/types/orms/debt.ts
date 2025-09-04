import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type BusinessUnit from './business-unit'
import type InterestUnit from '../../modules/installment/enums/debt-interest-unit'
import type TermUnit from '../../modules/installment/enums/debt-term-unit'
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
