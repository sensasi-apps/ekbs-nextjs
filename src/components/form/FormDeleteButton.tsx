'use client'

// vendors
import { useState } from 'react'
// materials
import Button, { type ButtonProps } from '@mui/material/Button'
// components
import ConfirmationDialog from '../ConfirmationDialog'

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
                open={isDialogOpen}
                title={titleText ?? 'Apakah Anda yakin ingin menghapus data?'}
                color="error"
                onConfirm={ev => onClick?.(ev)}
                cancelButtonProps={{
                    disabled: loading ?? undefined,
                }}
                confirmButtonProps={{
                    loading: loading,
                }}
                onCancel={() => setIsDialogOpen(false)}>
                {confirmationText ??
                    'Data yang dihapus tidak dapat dikembalikan.'}
            </ConfirmationDialog>

            <Button
                color="error"
                onClick={() => setIsDialogOpen(true)}
                disabled={disabled}
                loading={loading}
                {...props}>
                {children ?? 'Hapus'}
            </Button>
        </>
    )
}
