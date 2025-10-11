'use client'

// materials
import Typography from '@mui/material/Typography'
// vendors
import { useParams } from 'next/navigation'
import useSWR from 'swr'
// components
import LoadingCenter from '@/components/loading-center'
import UserOrLandRequisiteForm from '@/modules/clm/components/user-or-land-requisite-form'
// modules
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'

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
            <Typography mb={1} variant="h5">
                {requisite?.name}
            </Typography>

            <UserOrLandRequisiteForm
                data={{
                    files: [],
                    is_approved: Boolean(data.approved_at),
                    note: data.note,
                }}
                land_uuid={null}
                requisite_id={Number(requisite_id)}
                user_uuid={user_uuid}
            />
        </>
    )
}
