import { UUID } from 'crypto'

type UserDataType = {
    id: number
    is_active: boolean
    is_agreed_tncp: boolean
    nickname: string
    role_names: string[]
    role_names_id: string[]
    permission_names: string[]
    name: string
    email: string
    uuid: UUID
}

export default UserDataType
