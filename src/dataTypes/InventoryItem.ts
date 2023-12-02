import type { UUID } from 'crypto'
import type UserType from './User'
import type { Ymd } from '@/types/DateString'
import type Tag from './Tag'

type InventoryItem = {
    uuid: UUID
    name: string
    desc: string
    owned_at: Ymd
    disowned_at: Ymd
    disowned_note: string
    unfunctional_note: string

    tags: Tag[]

    pics: InventoryItemPic[]
    latest_pic?: InventoryItemPic

    checkups: InventoryItemCheckup[]
    latest_checkup?: InventoryItemCheckup
}

export default InventoryItem

type InventoryItemPic = {
    id: number
    inventory_item_uuid: UUID
    at: Ymd
    pic_user_uuid: UUID
    pic_user: UserType
    assigned_by_user_uuid: UUID
    assigned_by_user: UserType
}

type InventoryItemCheckup = {
    uuid: UUID
    by_user: UserType
    note: string
    at: Ymd
}
