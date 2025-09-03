import { type UUID } from 'crypto'
import type Address from '@/types/orms/address'
import type FarmerGroupType from '@/dataTypes/FarmerGroup'
//
import type RequisiteLandORM from './requisite-land'

export default interface LandORM {
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
    requisite_lands?: RequisiteLandORM[]
    requisite_lands_with_default?: RequisiteLandORM[]

    // getters
    is_requisites_fulfilled?: boolean
}
