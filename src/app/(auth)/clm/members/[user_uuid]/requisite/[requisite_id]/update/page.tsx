'use client'

// vendors
import { useParams } from 'next/navigation'
import useSWR from 'swr'
// materials
import Typography from '@mui/material/Typography'
// components
import LoadingCenter from '@/components/loading-center'
// modules
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'
import UserOrLandRequisiteForm from '@/modules/clm/components/user-or-land-requisite-form'

type ApiResponse = RequisiteUserORM & {
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

            <UserOrLandRequisiteForm
                user_uuid={user_uuid}
                land_uuid={null}
                requisite_id={Number(requisite_id)}
                data={{
                    note: data.note,
                    files: [],
                    is_approved: Boolean(data.approved_at),
                }}
            />
        </>
    )
}
