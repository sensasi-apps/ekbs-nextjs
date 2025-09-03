import type { UUID } from 'crypto'
import type InventoryItemORM from '@/types/orms/inventory-item'
import type { Ymd } from '@/types/DateString'

export default interface RentItemORM {
    inventory_item_uuid: UUID
    inventory_item: InventoryItemORM
    default_rate_rp_per_unit: number
    default_rate_unit: string

    deleted_at?: Ymd
}
