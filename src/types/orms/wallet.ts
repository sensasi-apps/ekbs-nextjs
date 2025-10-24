import type { UUID } from 'node:crypto'
import type User from '@/modules/user/types/orms/user'

export default interface WalletORM {
    uuid: UUID
    balance: number
    user_uuid: UUID

    // relations
    user?: User
}
