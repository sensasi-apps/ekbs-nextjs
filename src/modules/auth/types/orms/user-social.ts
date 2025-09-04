import type Social from './social'

export default interface UserSocialORM {
    uuid: string
    user_uuid: string
    social_id: Social['id']
    username: string
    username_bid: string

    // relations
    social: Social
}
