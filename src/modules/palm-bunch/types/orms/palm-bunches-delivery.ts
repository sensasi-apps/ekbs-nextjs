import type { UUID } from 'crypto'
import type User from '@/modules/auth/types/orms/user'
import type PalmBunchType from './palm-bunch'
import type ActivityLogORM from '@/types/orms/activity-log'
import type PalmBunchesReaTicket from './palm-bunch-rea-ticket'

export default interface PalmBunchesDeliveryORM {
    uuid: number
    to_oil_mill_code: string
    courier_user_uuid: UUID
    vehicle_no: string
    from_position: string

    palm_bunch_delivery_rate_id: number
    determined_rate_rp_per_kg: number

    n_kg?: number
    n_bunches?: number
    courier_user?: User

    palm_bunches: PalmBunchType[]
    transactions: []
    logs: ActivityLogORM[]

    // relations
    deliverable?: PalmBunchesReaTicket
    rate?: {
        rp_per_kg: number
    }
}
