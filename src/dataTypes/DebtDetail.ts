import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type { Transaction } from './Transaction'

export default interface DebtDetail {
    uuid: UUID
    due: Ymd
    paid: null | Ymd
    rp: number

    // relations
    transaction?: Transaction
}
