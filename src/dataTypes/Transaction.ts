import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type ActivityLogType from './ActivityLog'
import type BusinessUnitCash from './BusinessUnitCash'
import type CashType from './Cash'
import type PalmBunchType from './PalmBunch'
import type PalmBunchesDeliveryType from './PalmBunchesDelivery'
import type Tag from './Tag'
import type WalletType from './Wallet'
import type FarmerGroupType from './FarmerGroup'
// import FarmerGroupType from './FarmerGroup'

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

export type Transaction = {
    uuid: UUID
    amount: number
    at: Ymd
    desc: null | string
    cashable_uuid:
        | CashType['uuid']
        | WalletType['uuid']
        | BusinessUnitCash['uuid']
    cashable_classname: CashableClassname

    // appends
    short_uuid: string
    type: 'income' | 'expense' | 'transfer'
    is_transaction_destination: boolean

    // relations
    cashTransferDestination?: CashTransfer
    cashTransferOrigin?: CashTransfer
    user_activity_logs?: ActivityLogType[]
    transactionable?: null | PalmBunchesDeliveryType | PalmBunchType
    tags: Tag[]
    cashable?: CashType | WalletType | BusinessUnitCash
    cash_transfer_origin?: CashTransfer

    business_unit_cash?: BusinessUnitCash
    cash?: CashType
    wallet?: WalletType
    farmer_group_cash?: {
        uuid: UUID
        farmer_group_uuid: UUID
        farmer_group: FarmerGroupType
    }
} & (TransferType | NonTransferType)

export enum CashableClassname {
    Cash = 'App\\Models\\Cash',
    UserCash = 'App\\Models\\UserCash',
    BusinessUnitCash = 'App\\Models\\BusinessUnitCash',
}

type CashTransfer = {
    from_transaction_uuid: UUID
    to_transaction_uuid: UUID

    // relations
    transaction_origin?: Transaction
    transaction_destination?: Transaction
}
