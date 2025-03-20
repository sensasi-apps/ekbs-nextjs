import type Social from './social'

export default interface UserSocial {
    uuid: string
    user_uuid: string
    social_id: Social['id']
    username: string
    username_bid: string

    // relations
    social: Social
}
