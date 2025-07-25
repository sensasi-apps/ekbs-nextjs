import type { UUID } from 'crypto'
import type UserType from '../features/user/types/user'
import type { Ymd } from '@/types/DateString'
import type Tag from './Tag'
import type RentItem from './RentItem'

export default interface InventoryItem {
    uuid: UUID
    code: string
    name: string
    desc: string
    owned_at: Ymd
    disowned_at: Ymd
    disowned_note: string
    unfunctional_note: string

    rentable: RentItem

    tags: Tag[]

    pics: InventoryItemPic[]
    latest_pic?: InventoryItemPic

    checkups: InventoryItemCheckup[]
    latest_checkup?: InventoryItemCheckup
}

type InventoryItemPic = {
    id: number
    inventory_item_uuid: UUID
    at: Ymd
    pic_user_uuid: UUID
    pic_user: UserType
    assigned_by_user_uuid: UUID
    assigned_by_user: UserType
}

export type InventoryItemCheckup = {
    uuid: UUID
    by_user: UserType
    note: string
    at: Ymd
    he: HeCheckup | null
    inventory_item: InventoryItem | null
}

type HeCheckup = {
    hm: number
}
