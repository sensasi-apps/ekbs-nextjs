import useSWR from 'swr'

import type User from '@/modules/auth/types/orms/user'
import type UserSocial from '@/modules/auth/types/orms/user-social'
import type Social from '@/modules/auth/types/orms/social'
// modules
import type CertificationORM from '@/modules/clm/types/orms/certification'
import type LandORM from '@/modules/clm/types/orms/land'
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'

export interface ClmMemberDetailResponse {
    lands: LandORM[]
    user: UserWithSocials
    certifications: CertificationORM[]
    requisite_users_with_default: RequisiteUserORM[]
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
