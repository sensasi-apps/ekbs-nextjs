import type { UUID } from 'crypto'
import type User from '@/modules/user/types/orms/user'

export default interface WalletORM {
    uuid: UUID
    balance: number
    user_uuid: UUID

    // relations
    user?: User
}
