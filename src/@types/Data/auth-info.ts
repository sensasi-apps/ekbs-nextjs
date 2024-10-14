import type User from '@/dataTypes/User'

export type AuthInfo = {
    id: User['id']
    uuid: User['uuid']
    name: User['name']
    is_agreed_tncp: User['is_agreed_tncp']
    is_active: User['is_active']
    access_token: string
    permission_names: User['permission_names']
    role_names: User['role_names']

    // TODO: remove this if possible
    role_names_id?: User['role_names_id']

    should_revoke_access_token_on_logout?: boolean
}
