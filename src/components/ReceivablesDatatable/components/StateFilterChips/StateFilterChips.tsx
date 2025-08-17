'use client'

// vendors
import { useSearchParams } from 'next/navigation'
// materials
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
// components
import ScrollableXBox from '@/components/ScrollableXBox'

const FAKE_ONCLICK = () => undefined

export function StateFilterChips() {
    const searchParams = useSearchParams()

    const state = searchParams?.get('state')

    /**
     * type value is set on TypeFilterChips component
     *
     * @see [`<TypeFilterChips />`](..\TypeFilterChips\TypeFilterChips.tsx)
     */
    const type = searchParams?.get('type') ?? ''

    return (
        <ScrollableXBox>
            <Chip
                size="small"
                component={Link}
                label="Semua"
                href={'?state=&type=' + type}
                onClick={!state ? undefined : FAKE_ONCLICK}
                color={state ? undefined : 'success'}
            />

            <Chip
                size="small"
                component={Link}
                label="Dekat Jatuh Tempo"
                href={'?state=due-soon' + '&type=' + type}
                onClick={state === 'due-soon' ? undefined : FAKE_ONCLICK}
                color={state === 'due-soon' ? 'success' : undefined}
            />

            <Chip
                size="small"
                component={Link}
                label="Jatuh Tempo"
                href={'?state=due' + '&type=' + type}
                onClick={state === 'due' ? undefined : FAKE_ONCLICK}
                color={state === 'due' ? 'success' : undefined}
            />

            <Chip
                size="small"
                component={Link}
                label="Lunas"
                href={'?state=paid' + '&type=' + type}
                onClick={state === 'paid' ? undefined : FAKE_ONCLICK}
                color={state === 'paid' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}
