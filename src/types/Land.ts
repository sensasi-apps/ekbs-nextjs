import { type UUID } from 'crypto'
import type Address from './Address'

export default interface Land {
    uuid: UUID
    user_uuid: UUID
    farmer_group_uuid: UUID
    farmer_group: { uuid: UUID; name: string }
    n_area_hectares: number
    rea_land_id: string
    planted_at: string
    note: string
    address: Address
}
