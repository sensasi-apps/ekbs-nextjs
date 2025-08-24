import { type UUID } from 'crypto'
import type Address from './Address'
import type FarmerGroupType from '@/dataTypes/FarmerGroup'
import type RequisiteLand from '@/features/clm/types/requisite-land'

export default interface Land {
    uuid: UUID
    user_uuid: UUID
    farmer_group_uuid: UUID
    n_area_hectares: number
    rea_land_id: string
    planted_at: string
    note: string
    address: Address

    // relationships
    farmer_group?: FarmerGroupType
    requisite_lands?: RequisiteLand[]
    requisite_lands_with_default?: RequisiteLand[]

    // getters
    is_requisites_fulfilled?: boolean
}
