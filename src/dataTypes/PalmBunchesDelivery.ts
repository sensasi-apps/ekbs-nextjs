import type { UUID } from 'crypto'
import type UserType from './User'
import type PalmBunchType from './PalmBunch'
import type ActivityLogType from './ActivityLog'

interface PalmBunchesDeliveryType {
    uuid: number
    to_oil_mill_code: string
    courier_user_uuid: UUID
    vehicle_no: string
    from_position: string

    palm_bunch_delivery_rate_id: number
    determined_rate_rp_per_kg: number

    n_kg?: number
    n_bunches?: number
    courier_user?: UserType

    palm_bunches: PalmBunchType[]
    transactions: []
    logs: ActivityLogType[]
}

export default PalmBunchesDeliveryType
