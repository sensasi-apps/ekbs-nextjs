import type UserType from './User'

import { UUID } from 'crypto'

interface WalletType {
    uuid: UUID
    balance: number
    user: UserType
    user_uuid: UUID
}

export default WalletType
