import type { UUID } from 'crypto'
import type ActivityLogType from './activity-log'
import type User from '../../modules/auth/types/orms/user'
import type PalmBunchesDeliveryType from './palm-bunches-delivery'

export default interface PalmBunchORM {
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
