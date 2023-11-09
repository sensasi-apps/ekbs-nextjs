import type ActivityLogType from './ActivityLog'
import type CashType from './Cash'
import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'

type TransferType =
    | {
          type: 'transfer'
          is_transaction_destination: false
          to_cash_uuid: UUID
      }
    | {
          type: 'transfer'
          is_transaction_destination: true
          to_cash_uuid: null
      }

type NonTransferType = {
    type: 'income' | 'expense'
    is_transaction_destination: false
    to_cash_uuid: null
}

type TransactionType = {
    uuid: UUID
    amount: number
    at: Ymd
    desc: null | string
    cashable_uuid: UUID

    // appends
    cash: CashType
    user_activity_logs: ActivityLogType[]
    transactionable: null | unknown
} & (TransferType | NonTransferType)

export default TransactionType
