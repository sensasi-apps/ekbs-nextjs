import useSWR from 'swr'

import type RequisiteUser from '@/features/clm/types/requisite-user'
import type Land from '@/types/Land'
import type User from '@/features/user/types/user'
import type UserSocial from '@/features/user/types/user-social'
import type Social from '@/features/user/types/social'
import type CertificationORM from '@/modules/clm/types/orms/certification'

export interface ClmMemberDetailResponse {
    lands: Land[]
    user: UserWithSocials
    certifications: CertificationORM[]
    requisite_users_with_default: RequisiteUser[]
}

type UserWithSocials = User & {
    socials: (UserSocial & {
        social: Social
    })[]
}

export default function useClmMemberDetailSwr(user_uuid: string) {
    return useSWR<ClmMemberDetailResponse>(`/clm/members/${user_uuid}`, null, {
        revalidateOnMount: true,
    })
}
