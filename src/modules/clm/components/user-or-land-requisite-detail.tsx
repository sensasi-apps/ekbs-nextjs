// vendors

// materials
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'
import { useState } from 'react'
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

                <Button
                    color="warning"
                    component={NextLink}
                    href={`${requisite_id}/update`}>
                    Perbarui Data
                </Button>
            </FlexBox>

            <Typography component="div" mt={2} variant="caption">
                Berkas Syarat:
            </Typography>

            <Typography component="div" variant="h5">
                {requisite?.name}
            </Typography>

            {getStatus(data)}

            <Typography component="div" mt={2} variant="caption">
                Catatan:
            </Typography>

            <Typography component="div">{note}</Typography>

            <Typography component="div" mt={2} variant="caption">
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
                        checked={showDeleteFileButton}
                        color="warning"
                        id="show-delete-file-button"
                        onChange={() => setShowDeleteFileButton(prev => !prev)}
                        size="small"
                    />

                    <Typography
                        color="textDisabled"
                        component="label"
                        htmlFor="show-delete-file-button"
                        sx={{
                            cursor: 'pointer',
                        }}
                        variant="caption">
                        tampilkan tombol hapus berkas?
                    </Typography>
                </FlexBox>
            )}
        </>
    )
}

const BASE_TYPOGRAPHY_PROPS = {
    component: 'div',
    mt: 1,
    variant: 'caption',
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
