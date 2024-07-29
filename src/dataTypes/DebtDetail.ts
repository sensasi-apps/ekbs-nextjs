import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import Transaction from './Transaction'

type DebtDetail = {
    uuid: UUID
    due: Ymd
    paid: null | Ymd
    rp: number

    // relations
    transaction?: Transaction
}

export default DebtDetail
