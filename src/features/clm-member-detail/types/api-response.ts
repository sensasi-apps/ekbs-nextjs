import type RequisiteUser from '@/features/clm/types/requisite-user'
import type File from '@/dataTypes/File'
import type Land from '@/types/Land'
import type RequisiteLand from '@/features/clm/types/requisite-land'
import type User from '@/features/user/types/user'
import type UserSocial from '@/features/user/types/user-social'
import type Social from '@/features/user/types/social'

export default interface ApiResponse {
    lands: (Land & {
        requisite_lands: RequisiteLand[]
        is_requisites_fulfilled: boolean
    })[]
    requisite_users: (RequisiteUser & {
        files: File[]
    })[]
    user: User & {
        socials: (UserSocial & {
            social: Social
        })[]
    }
}
