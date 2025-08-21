'use client'

// vendors
import { useParams } from 'next/navigation'
import useSWR from 'swr'
// materials
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
// components
import type RequisiteUser from '@/features/clm/types/requisite-user'
import BackButton from '@/components/back-button'
import FileList from '@/components/file-list'
import LoadingCenter from '@/components/loading-center'

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

    const { requisite, approved_by_user, approved_at } = data

    return (
        <>
            <BackButton />

            <Typography variant="caption" component="div" mt={2}>
                Berkas Syarat:
            </Typography>

            <Typography variant="h5" component="div">
                {requisite?.name}
            </Typography>

            {approved_by_user && (
                <Typography
                    variant="caption"
                    component="div"
                    mt={1}
                    color="success">
                    Telah disetujui oleh <b>{approved_by_user.name}</b> pada{' '}
                    <b>{approved_at}</b>
                </Typography>
            )}

            <Typography variant="caption" component="div" mt={2}>
                Catatan:
            </Typography>

            <Typography component="div">{data.note}</Typography>

            <Typography variant="caption" component="div" mt={2}>
                Berkas:
            </Typography>

            <FileList files={data.files ?? []} />

            <Button href={requisite_id + '/form'}>Perbarui Data</Button>
        </>
    )
}
