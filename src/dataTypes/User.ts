import { UUID } from 'crypto'

interface UserType {
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

    socials?: []
    last_six_months_tbs_performance?: []

    member?: any // TODO: define member type
    employee?: any // TODO: define employee type
    phone_no?: string
}

export default UserType
