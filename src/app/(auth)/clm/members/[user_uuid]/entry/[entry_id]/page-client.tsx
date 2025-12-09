'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import type EntryORM from '@/app/(auth)/surveys/_orms/entry'
import EntryCard from '@/app/(auth)/surveys/[id]/entries/entrry-card'
import LoadingCenter from '@/components/loading-center'

export default function PageClient() {
    const params = useParams()
    const user_uuid = params.user_uuid
    const entry_id = params.entry_id

    const { data: entry } = useSWR<EntryORM>(
        `clm/members/${user_uuid}/entries/${entry_id}`,
    )

    if (!entry) {
        return <LoadingCenter />
    }

    return (
        <EntryCard
            entry={entry}
            entryNumber={entry.id}
            onUserAssigned={() => {}}
            sections={entry.survey?.sections}
        />
    )
}
