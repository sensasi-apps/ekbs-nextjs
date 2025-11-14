'use client'

import useSWR from 'swr'
import BigNumberCard, {
    type BigNumberCardProps,
} from '@/components/stat-card.big-number-card'
import TopLoadingBar from '@/components/top-loading-bar'
import RoleEnum from '@/enums/role'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'

export function Cards() {
    const isAuthHasRole = useIsAuthHasRole()

    const { data = [], isValidating } = useSWR<BigNumberCardProps[]>(
        isAuthHasRole(RoleEnum.SUPERMAN) ? 'data/dashboard' : null,
    )

    return (
        <>
            {isValidating && <TopLoadingBar />}

            {data.map(item => (
                <BigNumberCard key={item.title?.toString()} {...item} />
            ))}
        </>
    )
}
