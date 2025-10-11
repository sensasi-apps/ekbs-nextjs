'use client'

// vendors
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import LoadingCenter from '@/components/loading-center'
import UserOrLandRequisiteDetail from '@/modules/clm/components/user-or-land-requisite-detail'
// modules
import type RequisiteLandORM from '@/modules/clm/types/orms/requisite-land'

type ApiResponse = RequisiteLandORM & {
    uuid?: string
}

export default function RequisiteUserPage() {
    const { requisite_id, user_uuid, land_uuid } = useParams<{
        requisite_id: string
        user_uuid: string
        land_uuid: string
    }>()

    const { data } = useSWR<ApiResponse>(
        `/clm/members/${user_uuid}/lands/${land_uuid}/${requisite_id}`,
        null,
        {
            revalidateOnMount: true,
        },
    )

    if (!data) return <LoadingCenter />

    return <UserOrLandRequisiteDetail data={data} />
}
