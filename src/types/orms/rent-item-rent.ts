import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type ActivityLogType from './activity-log'
import type FarmerGroupType from './farmer-group'
import type FileORM from './file'
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import type InventoryItemORM from './inventory-item'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type UserORM from '@/modules/auth/types/orms/user'

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
    inventory_item: InventoryItemORM
    by_user?: UserORM
    transaction?: TransactionORM
    installments?: InstallmentORM[]
    installment?: {
        interest_percent: number
        n_term: number
        term_unit: 'minggu' | 'bulan'
    }
    farmer_group?: FarmerGroupType
    heavy_equipment_rent?: {
        operated_by_user_uuid: UUID
        operated_by_user: UserORM
        start_hm?: number
        end_hm?: number
        note?: string
        file?: FileORM
    }
    user_activity_logs: ActivityLogType[]
    validated_by_admin_user?: UserORM
}
