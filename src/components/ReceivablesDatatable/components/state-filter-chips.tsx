'use client'

// materials
import Chip from '@mui/material/Chip'
import Link from 'next/link'
// vendors
import { useSearchParams } from 'next/navigation'
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
                clickable={Boolean(state)}
                color={state ? undefined : 'success'}
                component={Link}
                href={`?state=&type=${type}`}
                label="Semua"
                size="small"
            />

            <Chip
                clickable={state !== 'due-soon'}
                color={state === 'due-soon' ? 'success' : undefined}
                component={Link}
                href={`?state=due-soon&type=${type}`}
                label="Dekat Jatuh Tempo"
                size="small"
            />

            <Chip
                clickable={state !== 'due'}
                color={state === 'due' ? 'success' : undefined}
                component={Link}
                href={`?state=due&type=${type}`}
                label="Jatuh Tempo"
                size="small"
            />

            <Chip
                clickable={state !== 'paid'}
                color={state === 'paid' ? 'success' : undefined}
                component={Link}
                href={`?state=paid&type=${type}`}
                label="Lunas"
                size="small"
            />
        </ScrollableXBox>
    )
}
