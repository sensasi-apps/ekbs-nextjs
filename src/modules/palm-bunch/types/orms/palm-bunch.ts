import type { UUID } from 'crypto'
import type ActivityLogORM from '@/types/orms/activity-log'
import type UserORM from '@/modules/user/types/orms/user'
import type PalmBunchesDeliveryType from './palm-bunches-delivery'

export default interface PalmBunchORM {
    uuid: UUID
    land_desc: string
    farmer_group_uuid: UUID

    n_kg?: number
    owner_user_uuid?: UUID

    // relations
    owner_user?: UserORM
    logs?: ActivityLogORM[]
    delivery?: PalmBunchesDeliveryType
}
