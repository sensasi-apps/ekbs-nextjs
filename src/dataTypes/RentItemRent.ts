import type { UUID } from 'crypto'
import type UserType from './User'
import type { Ymd } from '@/types/DateString'
import type TransactionType from './Transaction'
import type InstallmentType from './Installment'
import type InventoryItem from './InventoryItem'
import type FarmerGroupType from './FarmerGroup'

type RentItemRent = {
    uuid: UUID
    inventory_item_uuid: UUID
    inventory_item: InventoryItem

    by_user_uuid?: UUID
    by_user?: UserType

    rate_rp_per_unit: number
    rate_unit: 'jam'
    for_n_units: number
    for_at: Ymd
    finished_at?: Ymd
    note?: string

    transaction?: TransactionType
    installments?: InstallmentType[]
    installment: {
        interest_percent: number
        n_term: number
        term_unit: 'minggu' | 'bulan'
    }
    is_paid: boolean

    farmer_group?: FarmerGroupType

    heavy_equipment_rent?: {
        operated_by_user_uuid: UUID
        operated_by_user: UserType
        start_hm?: number
        end_hm?: number
        note?: string
    }
}

export default RentItemRent
