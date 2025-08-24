'use client'

// vendors
import { useParams } from 'next/navigation'
import useSWR from 'swr'
// materials
import Typography from '@mui/material/Typography'
// components
import type RequisiteUser from '@/modules/clm/types/orms/requisite-user'
import LoadingCenter from '@/components/loading-center'
import RequisiteUserForm from './requisite-user-form'
import type { UUID } from 'crypto'

type ApiResponse = RequisiteUser & {
    uuid?: string
}

export default function RequisiteUserPage() {
    const { requisite_id, user_uuid } = useParams<{
        requisite_id: string
        user_uuid: string
    }>()

    const { data } = useSWR<ApiResponse>(
        `/clm/members/${user_uuid}/${requisite_id}`,
    )

    if (!data) return <LoadingCenter />

    const { requisite } = data

    return (
        <>
            <Typography variant="caption">Berkas Syarat:</Typography>
            <Typography variant="h5" mb={1}>
                {requisite?.name}
            </Typography>

            <RequisiteUserForm
                user_uuid={user_uuid as UUID}
                requisite_id={requisite_id as unknown as number}
                data={{
                    note: data.note,
                    files: [],
                    is_approved: Boolean(data.approved_at),
                }}
            />
        </>
    )
}
