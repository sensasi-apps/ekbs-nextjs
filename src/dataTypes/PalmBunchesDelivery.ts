import { UUID } from 'crypto'
import UserDataType from './User'
import PalmBunchDataType from './PalmBunch'

type PalmBunchesDeliveryDataType = {
    uuid: number
    to_oil_mill_code: string
    courier_user_uuid: UUID
    vehicle_no: string
    from_position: string
    palm_bunch_delivery_rate_id: number
    n_bunches: number
    n_kg: number

    courier_user: UserDataType
    palm_bunches: PalmBunchDataType[]
    transaction: any
}

export default PalmBunchesDeliveryDataType
