import type User from '@/modules/user/types/orms/user'

/**
 * API response from `data/minimal-users`.
 */
export default interface MinimalUser
    extends Pick<User, 'id' | 'uuid' | 'name' | 'nickname' | 'role_names_id'> {}
