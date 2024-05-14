import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type PayrollUser from './PayrollUser'
import type UserType from './User'
import type BusinessUnit from './BusinessUnit'
import type TransactionType from './Transaction'

type Payroll = {
    uuid: UUID
    at: Ymd
    type: PayrollType
    note: string
    cash_uuid: UUID | null
    processed_at: Ymd | null
    processed_by_user_uuid: Ymd | null

    // computed
    short_uuid: string

    // caches
    earning_rp_cache: number
    deduction_rp_cache: number
    final_rp_cache: number

    // relations
    processed_by_user?: UserType
    users?: PayrollUser[]
    cost_shares?: PayrollCostShare[]
    transaction?: TransactionType
}

export default Payroll

export type PayrollType = 'pengelola' | 'pengurus' | 'pengawas' | 'pendiri'

type PayrollCostShare = {
    uuid: UUID
    // business_unit_id: number
    deduction_rp: number
    earning_rp: number
    final_rp_cache: number

    // relations
    business_unit?: BusinessUnit
    transactions?: TransactionType[]
}
