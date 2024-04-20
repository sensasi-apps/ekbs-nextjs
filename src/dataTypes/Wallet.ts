import type { UUID } from 'crypto'
import type UserType from './User'

type Wallet = {
    uuid: UUID
    balance: number
    user_uuid: UUID

    // relations
    user?: UserType
}

export default Wallet
