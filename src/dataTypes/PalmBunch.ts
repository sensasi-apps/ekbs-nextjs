import { UUID } from 'crypto'
import UserDataType from './User'

type PalmBunchDataType = {
    uuid: UUID
    owner_user_uuid: UUID
    land_desc: string
    farmer_group_uuid: UUID
    n_kg: number

    owner_user: UserDataType
}

export default PalmBunchDataType
