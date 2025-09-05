'use client'

import useSWR from 'swr'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
// modules
import type UserORM from '@/modules/user/types/orms/user'

export default function useUserDetailSwr() {
    const { uuid } = useParams()
    const { replace } = useRouter()
    const searchParams = useSearchParams()

    if (!uuid) throw new Error('uuid (user uuid) is required')

    return useSWR<UserORM>(uuid ? `users/${uuid}` : null, null, {
        onError: () => {
            replace('/systems/users?role=' + searchParams?.get('role'))
        },
    })
}
