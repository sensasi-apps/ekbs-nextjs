import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type ActivityLogType from './activity-log'
import type FarmerGroupType from './farmer-group'
import type File from './file'
import type { Installment } from '../../dataTypes/Installment'
import type InventoryItem from './inventory-item'
import type { Transaction } from '../../dataTypes/Transaction'
import type UserType from '../../modules/auth/types/orms/user'

export default interface RentItemRentORM {
    // columns
    uuid: UUID
    inventory_item_uuid: UUID
    by_user_uuid?: UUID
    payment_method: 'cash' | 'wallet' | 'installment' | 'fgwallet'
    rate_rp_per_unit: number
    rate_unit: 'H.M' | 'sewa'
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
    transaction?: Transaction
    installments?: Installment[]
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
