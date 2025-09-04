// features
import type User from '@/modules/auth/types/orms/user'

export default interface PublicProfile {
    name: User['name']
    profile_picture_blob: string
    socials: User['socials']

    member: {
        joined_at: string | null
        unjoined_at: string | null
    }
    employee: {
        joined_at: string | null
        unjoined_at: string | null
        position: string | null
    }
}
