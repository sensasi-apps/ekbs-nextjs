import type { UUID } from 'crypto'
import type User from '@/features/user/types/user'

export default interface WalletORM {
    uuid: UUID
    balance: number
    user_uuid: UUID

    // relations
    user?: User
}
