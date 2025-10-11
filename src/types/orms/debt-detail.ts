import type { UUID } from 'crypto'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type { Ymd } from '@/types/date-string'

export default interface DebtDetailORM {
    uuid: UUID
    due: Ymd
    paid: null | Ymd
    rp: number

    // relations
    transaction?: TransactionORM
}
