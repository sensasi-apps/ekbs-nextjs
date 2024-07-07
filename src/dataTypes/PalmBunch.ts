import type { UUID } from 'crypto'
import type ActivityLogType from './ActivityLog'
import type UserType from './User'
import type PalmBunchesDeliveryType from './PalmBunchesDelivery'

interface PalmBunchType {
    uuid: UUID
    land_desc: string
    farmer_group_uuid: UUID

    n_kg?: number
    owner_user_uuid?: UUID

    // relations
    owner_user?: UserType
    logs?: ActivityLogType[]
    delivery?: PalmBunchesDeliveryType
}

export default PalmBunchType
