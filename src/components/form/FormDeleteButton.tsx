'use client'

// materials
import Button, { type ButtonProps } from '@mui/material/Button'
// vendors
import { useState } from 'react'
// components
import ConfirmationDialog from '../confirmation-dialog'

export type FormDeleteButtonProps = ButtonProps & {
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
}: ButtonProps & {
    titleText?: string
    confirmationText?: string
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <>
            <ConfirmationDialog
                cancelButtonProps={{
                    disabled: loading ?? undefined,
                }}
                color="error"
                confirmButtonProps={{
                    loading: loading,
                }}
                onCancel={() => setIsDialogOpen(false)}
                onConfirm={ev => onClick?.(ev)}
                open={isDialogOpen}
                title={titleText ?? 'Apakah Anda yakin ingin menghapus data?'}>
                {confirmationText ??
                    'Data yang dihapus tidak dapat dikembalikan.'}
            </ConfirmationDialog>

            <Button
                color="error"
                disabled={disabled}
                loading={loading}
                onClick={() => setIsDialogOpen(true)}
                {...props}>
                {children ?? 'Hapus'}
            </Button>
        </>
    )
}
