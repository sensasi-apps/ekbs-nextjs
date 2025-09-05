import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'

export default interface DebtDetailORM {
    uuid: UUID
    due: Ymd
    paid: null | Ymd
    rp: number

    // relations
    transaction?: TransactionORM
}
