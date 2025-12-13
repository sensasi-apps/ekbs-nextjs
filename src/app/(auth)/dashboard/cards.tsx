'use client'

import useSWR from 'swr'
import BigNumberCard, {
    type BigNumberCardProps,
} from '@/components/stat-card.big-number-card'
import TopLinearProgress from '@/components/top-linear-progress'
import RoleEnum from '@/enums/role'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'

export function Cards() {
    const isAuthHasRole = useIsAuthHasRole()

    const { data = [], isValidating } = useSWR<BigNumberCardProps[]>(
        isAuthHasRole(RoleEnum.SUPERMAN) ? 'data/dashboard' : null,
    )

    return (
        <>
            <TopLinearProgress show={isValidating} />

            {data.map(item => (
                <BigNumberCard key={item.title?.toString()} {...item} />
            ))}
        </>
    )
}
