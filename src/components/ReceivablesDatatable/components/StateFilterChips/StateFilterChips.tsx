// vendors
import { useRouter } from 'next/router'
import { useEffect } from 'react'
// components
import ChipSmall from '@/components/ChipSmall'
import ScrollableXBox from '@/components/ScrollableXBox'

export function StateFilterChips() {
    const { replace, query, isReady } = useRouter()

    function handleStateChange(value?: string) {
        replace({
            query: {
                ...query,
                state: value,
            },
        })
    }

    useEffect(() => {
        if (isReady && !query.state) {
            handleStateChange('due')
        }
    }, [])

    return (
        <ScrollableXBox>
            <ChipSmall
                label="Semua"
                onClick={() => handleStateChange(undefined)}
                color={query.state ? undefined : 'success'}
            />

            <ChipSmall
                label="Dekat Jatuh Tempo"
                onClick={() => handleStateChange('due-soon')}
                color={query.state === 'due-soon' ? 'success' : undefined}
            />

            <ChipSmall
                label="Jatuh Tempo"
                onClick={() => handleStateChange('due')}
                color={query.state === 'due' ? 'success' : undefined}
            />

            <ChipSmall
                label="Lunas"
                onClick={() => handleStateChange('paid')}
                color={query.state === 'paid' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}
