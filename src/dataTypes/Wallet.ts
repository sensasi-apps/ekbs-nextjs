import { UUID } from 'crypto'
import UserDataType from './User'

interface WalletType {
    uuid: UUID
    balance: number
    user: UserDataType
}

export default WalletType
