import type { UUID } from 'crypto'
import type MinimalUser from '@/modules/user/types/minimal-user'
import type UserORM from '@/modules/user/types/orms/user'
import type ActivityLogORM from '@/types/orms/activity-log'
import type PalmBunchesDeliveryType from './palm-bunches-delivery'

export default interface PalmBunchORM {
    uuid: UUID
    land_desc: string
    farmer_group_uuid: UUID

    n_kg?: number
    owner_user_uuid?: UUID

    /**
     * [🔗]
     *
     * @todo remove `| MinimalUser` by change `PalmBunchReaTicket` Form on {@link @\components\PalmBunchesReaTicket\Form\MainInputs}
     */
    owner_user?: UserORM | MinimalUser
    logs?: ActivityLogORM[]
    delivery?: PalmBunchesDeliveryType
}
