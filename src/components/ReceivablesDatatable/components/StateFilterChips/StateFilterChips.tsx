// vendors
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
// components
import ChipSmall from '@/components/ChipSmall'
import ScrollableXBox from '@/components/ScrollableXBox'

export function StateFilterChips() {
    const { replace, query, isReady } = useRouter()
    const { state } = query

    const handleStateChange = useCallback(
        (value?: string) =>
            replace({
                query: {
                    ...query,
                    state: value,
                },
            }),
        [replace, query],
    )

    useEffect(() => {
        if (isReady && !state) {
            handleStateChange('due')
        }
    }, [isReady, state, handleStateChange])

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
