import { LoadingButton, LoadingButtonProps } from '@mui/lab'
import ConfirmationDialog from '../ConfirmationDialog'
import { useState } from 'react'

export default function FormDeleteButton({
    onClick,
    disabled,
    loading,
    ...props
}: LoadingButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <>
            <ConfirmationDialog
                open={isDialogOpen}
                title="Apakah Anda yakin ingin menghapus data?"
                color="error"
                onConfirm={() => onClick?.({} as any)}
                cancelButtonProps={{
                    disabled: loading,
                }}
                confirmButtonProps={{
                    loading: loading,
                }}
                onCancel={() => setIsDialogOpen(false)}>
                Data yang dihapus tidak dapat dikembalikan.
            </ConfirmationDialog>

            <LoadingButton
                color="error"
                onClick={() => setIsDialogOpen(true)}
                disabled={disabled}
                loading={loading}
                {...props}>
                Hapus
            </LoadingButton>
        </>
    )
}
