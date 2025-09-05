import type { UUID } from 'crypto'
import type UserORM from '@/modules/user/types/orms/user'
import type { Ymd } from '@/types/date-string'
import type Tag from './tag'
import type RentItem from './rent-item'

export default interface InventoryItemORM {
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

    checkups: InventoryItemCheckupORM[]
    latest_checkup?: InventoryItemCheckupORM
}

type InventoryItemPic = {
    id: number
    inventory_item_uuid: UUID
    at: Ymd
    pic_user_uuid: UUID
    pic_user: UserORM
    assigned_by_user_uuid: UUID
    assigned_by_user: UserORM
}

export type InventoryItemCheckupORM = {
    uuid: UUID
    by_user: UserORM
    note: string
    at: Ymd
    he: HeCheckup | null
    inventory_item: InventoryItemORM | null
}

type HeCheckup = {
    hm: number
}
