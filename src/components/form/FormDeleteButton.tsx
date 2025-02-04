// vendors
import LoadingButton, { type LoadingButtonProps } from '@mui/lab/LoadingButton'
import { useState } from 'react'
// components
import ConfirmationDialog from '../ConfirmationDialog'

export type FormDeleteButtonProps = LoadingButtonProps & {
    titleText?: string
    confirmationText?: string
}

export default function FormDeleteButton({
    onClick,
    disabled,
    loading,
    children,
    titleText,
    confirmationText,
    ...props
}: LoadingButtonProps & {
    titleText?: string
    confirmationText?: string
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <>
            <ConfirmationDialog
                open={isDialogOpen}
                title={titleText ?? 'Apakah Anda yakin ingin menghapus data?'}
                color="error"
                onConfirm={ev => onClick?.(ev)}
                cancelButtonProps={{
                    disabled: loading,
                }}
                confirmButtonProps={{
                    loading: loading,
                }}
                onCancel={() => setIsDialogOpen(false)}>
                {confirmationText ??
                    'Data yang dihapus tidak dapat dikembalikan.'}
            </ConfirmationDialog>

            <LoadingButton
                color="error"
                onClick={() => setIsDialogOpen(true)}
                disabled={disabled}
                loading={loading}
                {...props}>
                {children ?? 'Hapus'}
            </LoadingButton>
        </>
    )
}
