import type UserORM from '@/modules/user/types/orms/user'

export default interface AuthInfo {
    id: UserORM['id']
    uuid: UserORM['uuid']
    name: UserORM['name']
    is_agreed_tncp: UserORM['is_agreed_tncp']
    is_active: UserORM['is_active']
    permission_names: UserORM['permission_names']
    role_names: UserORM['role_names']

    // TODO: remove this if possible
    role_names_id?: UserORM['role_names_id']
}
