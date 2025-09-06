'use client'

// vendors
import { useParams } from 'next/navigation'
import useSWR from 'swr'
// materials
import Typography from '@mui/material/Typography'
// components
import LoadingCenter from '@/components/loading-center'
// modules
import type RequisiteLandORM from '@/modules/clm/types/orms/requisite-land'
import UserOrLandRequisiteForm from '@/modules/clm/components/user-or-land-requisite-form'

type ApiResponse = RequisiteLandORM & {
    uuid?: string
}

export default function RequisiteUserPage() {
    const { user_uuid, land_uuid, requisite_id } = useParams<{
        user_uuid: string
        land_uuid: string
        requisite_id: string
    }>()

    const { data } = useSWR<ApiResponse>(
        `/clm/members/${user_uuid}/lands/${land_uuid}/${requisite_id}`,
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
                requisite_id={Number(requisite_id)}
                land_uuid={land_uuid}
                data={{
                    note: data.note,
                    files: [],
                    is_approved: Boolean(data.approved_at),
                }}
            />
        </>
    )
}
