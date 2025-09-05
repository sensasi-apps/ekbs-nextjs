'use client'

// vendors
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
// materials
import Chip from '@mui/material/Chip'
// components
import ScrollableXBox from '@/components/ScrollableXBox'

export default function StateFilterChips() {
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
                href={`?state=&type=${type}`}
                clickable={Boolean(state)}
                color={state ? undefined : 'success'}
            />

            <Chip
                size="small"
                component={Link}
                label="Dekat Jatuh Tempo"
                href={`?state=due-soon&type=${type}`}
                clickable={state !== 'due-soon'}
                color={state === 'due-soon' ? 'success' : undefined}
            />

            <Chip
                size="small"
                component={Link}
                label="Jatuh Tempo"
                href={`?state=due&type=${type}`}
                clickable={state !== 'due'}
                color={state === 'due' ? 'success' : undefined}
            />

            <Chip
                size="small"
                component={Link}
                label="Lunas"
                href={`?state=paid&type=${type}`}
                clickable={state !== 'paid'}
                color={state === 'paid' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}
