import type { UUID } from 'crypto'
import type ActivityLogType from './ActivityLog'
import type User from '../features/user/types/user'
import type PalmBunchesDeliveryType from './PalmBunchesDelivery'

export default interface PalmBunchType {
    uuid: UUID
    land_desc: string
    farmer_group_uuid: UUID

    n_kg?: number
    owner_user_uuid?: UUID

    // relations
    owner_user?: User
    logs?: ActivityLogType[]
    delivery?: PalmBunchesDeliveryType
}
