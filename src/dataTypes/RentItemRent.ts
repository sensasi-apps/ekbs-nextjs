import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type ActivityLogType from './ActivityLog'
import type FarmerGroupType from './FarmerGroup'
import type File from './File'
import type InstallmentType from './Installment'
import type InventoryItem from './InventoryItem'
import type TransactionType from './Transaction'
import type UserType from './User'

type RentItemRent = {
    // columns
    uuid: UUID
    inventory_item_uuid: UUID
    by_user_uuid?: UUID
    payment_method: 'cash' | 'wallet' | 'installment' | 'fgwallet'
    rate_rp_per_unit: number
    rate_unit: 'jam'
    for_n_units: number
    for_at: Ymd
    finished_at?: Ymd
    note?: string
    validated_by_admin_at?: Ymd
    type: 'personal' | 'farmer-group' | 'public-service'

    // getter
    short_uuid: string
    is_paid: boolean

    // relations
    inventory_item: InventoryItem
    by_user?: UserType
    transaction?: TransactionType
    installments?: InstallmentType[]
    installment?: {
        interest_percent: number
        n_term: number
        term_unit: 'minggu' | 'bulan'
    }
    farmer_group?: FarmerGroupType
    heavy_equipment_rent?: {
        operated_by_user_uuid: UUID
        operated_by_user: UserType
        start_hm?: number
        end_hm?: number
        note?: string
        file?: File
    }
    user_activity_logs: ActivityLogType[]
    validated_by_admin_user?: UserType
}

export default RentItemRent
