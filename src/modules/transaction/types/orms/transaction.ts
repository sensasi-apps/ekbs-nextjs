import type { UUID } from 'node:crypto'
import type PalmBunchType from '@/modules/palm-bunch/types/orms/palm-bunch'
import type PalmBunchesDeliveryType from '@/modules/palm-bunch/types/orms/palm-bunches-delivery'
import type { Ymd } from '@/types/date-string'
import type ActivityLogType from '@/types/orms/activity-log'
import type BusinessUnitCash from '@/types/orms/business-unit-cash'
import type CashType from '@/types/orms/cash'
import type FarmerGroupType from '@/types/orms/farmer-group'
import type Tag from '@/types/orms/tag'
import type WalletType from '@/types/orms/wallet'

export default interface Transaction {
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

    to_cash_uuid: null | UUID
}

export enum CashableClassname {
    Cash = 'App\\Models\\Cash',
    UserCash = 'App\\Models\\UserCash',
    BusinessUnitCash = 'App\\Models\\BusinessUnitCash',
}

interface CashTransfer {
    from_transaction_uuid: UUID
    to_transaction_uuid: UUID

    // relations
    transaction_origin?: Transaction
    transaction_destination?: Transaction
}
