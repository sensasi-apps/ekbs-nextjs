// vendors
import { useState } from 'react'
// materials
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
// components
import BackButton from '@/components/back-button'
import FileList from '@/components/file-list'
import FlexBox from '@/components/flex-box'
// modules
import type RequisiteLandORM from '@/modules/clm/types/orms/requisite-land'
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'

export default function UserOrLandRequisiteDetail({
    data,
}: {
    data: RequisiteLandORM | RequisiteUserORM
}) {
    const [showDeleteFileButton, setShowDeleteFileButton] = useState(false)

    const { requisite, approved_at, files, note, requisite_id } = data

    return (
        <>
            <FlexBox justifyContent="space-between" mb={2}>
                <BackButton />

                <Button href={requisite_id + '/form'} color="warning">
                    Perbarui Data
                </Button>
            </FlexBox>

            <Typography variant="caption" component="div" mt={2}>
                Berkas Syarat:
            </Typography>

            <Typography variant="h5" component="div">
                {requisite?.name}
            </Typography>

            {getStatus(data)}

            <Typography variant="caption" component="div" mt={2}>
                Catatan:
            </Typography>

            <Typography component="div">{note}</Typography>

            <Typography variant="caption" component="div" mt={2}>
                Berkas:
            </Typography>

            <FileList
                files={files ?? []}
                showDeleteButton={showDeleteFileButton}
                showEditNameButton={!approved_at}
            />

            {(files ?? []).length > 0 && !approved_at && (
                <FlexBox mt={2}>
                    <Switch
                        id="show-delete-file-button"
                        size="small"
                        checked={showDeleteFileButton}
                        onChange={() => setShowDeleteFileButton(prev => !prev)}
                        color="warning"
                    />

                    <Typography
                        variant="caption"
                        component="label"
                        htmlFor="show-delete-file-button"
                        color="textDisabled"
                        sx={{
                            cursor: 'pointer',
                        }}>
                        tampilkan tombol hapus berkas?
                    </Typography>
                </FlexBox>
            )}
        </>
    )
}

const BASE_TYPOGRAPHY_PROPS = {
    variant: 'caption',
    component: 'div',
    mt: 1,
} as const

function getStatus({
    approved_by_user,
    approved_at,
    files,
}: RequisiteLandORM | RequisiteUserORM) {
    if (!files?.length)
        return (
            <Typography {...BASE_TYPOGRAPHY_PROPS} color="error">
                Berkas belum diunggah
            </Typography>
        )

    if (!approved_by_user)
        return (
            <Typography {...BASE_TYPOGRAPHY_PROPS} color="warning">
                Perlu ditinjau
            </Typography>
        )

    return (
        <Typography {...BASE_TYPOGRAPHY_PROPS} color="success">
            Telah disetujui oleh <b>{approved_by_user?.name}</b> pada{' '}
            <b>{approved_at}</b>
        </Typography>
    )
}
