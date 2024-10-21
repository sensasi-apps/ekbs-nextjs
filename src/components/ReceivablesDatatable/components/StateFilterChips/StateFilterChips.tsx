// vendors
import { useRouter } from 'next/router'
import { useEffect } from 'react'
// components
import ChipSmall from '@/components/ChipSmall'
import ScrollableXBox from '@/components/ScrollableXBox'

export function StateFilterChips() {
    const { replace, query, isReady } = useRouter()
    const { state } = query

    useEffect(() => {
        if (!isReady) return

        replace({
            query: {
                ...query,
                state: 'due',
            },
        })
    }, [isReady])

    function handleStateChange(value?: string) {
        replace({
            query: {
                ...query,
                state: value,
            },
        })
    }

    return (
        <ScrollableXBox>
            <ChipSmall
                label="Semua"
                onClick={() => handleStateChange(undefined)}
                color={state ? undefined : 'success'}
            />

            <ChipSmall
                label="Dekat Jatuh Tempo"
                onClick={() => handleStateChange('due-soon')}
                color={state === 'due-soon' ? 'success' : undefined}
            />

            <ChipSmall
                label="Jatuh Tempo"
                onClick={() => handleStateChange('due')}
                color={state === 'due' ? 'success' : undefined}
            />

            <ChipSmall
                label="Lunas"
                onClick={() => handleStateChange('paid')}
                color={state === 'paid' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}
