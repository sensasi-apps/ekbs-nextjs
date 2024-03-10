import type ActivityLogType from './ActivityLog'
import type CashType from './Cash'
import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import Tag from './Tag'

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
    cashable_classname: CashableClassname

    // appends
    cash: CashType
    user_activity_logs: ActivityLogType[]
    transactionable: null | unknown

    // relations
    tags: Tag[]
} & (TransferType | NonTransferType)

export default TransactionType

export enum CashableClassname {
    Cash = 'App\\Models\\Cash',
    UserCash = 'App\\Models\\UserCash',
}
