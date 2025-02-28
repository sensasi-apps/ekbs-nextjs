import type { UUID } from 'crypto'
import type InventoryItem from './InventoryItem'
import type { Ymd } from '@/types/DateString'

export default interface RentItem {
    inventory_item_uuid: UUID
    inventory_item: InventoryItem
    default_rate_rp_per_unit: number
    default_rate_unit: string

    deleted_at?: Ymd
}
