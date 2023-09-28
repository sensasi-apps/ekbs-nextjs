import type UserType from './User'

import { UUID } from 'crypto'

interface PalmBunchType {
    uuid: UUID
    land_desc: string
    farmer_group_uuid: UUID

    n_kg?: number
    owner_user_uuid?: UUID
    owner_user?: UserType
}

export default PalmBunchType
