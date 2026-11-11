import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type InventoryItemORM from '@/types/orms/inventory-item'

export default interface RentItemORM {
    inventory_item_uuid: UUID
    inventory_item: InventoryItemORM
    default_rate_rp_per_unit: number
    default_rate_unit: string
    /** @deprecated Use meter_unit. */
    requires_hm: boolean
    meter_unit: 'H.M' | 'KM' | null

    deleted_at?: Ymd
}
