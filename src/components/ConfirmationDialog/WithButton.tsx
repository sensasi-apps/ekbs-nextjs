'use client'

// vendors
import { useState } from 'react'
// materials
import Button, { type ButtonProps } from '@mui/material/Button'
// components
import ConfirmationDialog from '../ConfirmationDialog'

export default function ConfirmationDialogWithButton({
    shouldConfirm = true,
    onConfirm,
    buttonProps,
    confirmButtonProps,
    ...props
}: {
    shouldConfirm: boolean
    onConfirm: () => void
    buttonProps?: ButtonProps
    confirmButtonProps?: ButtonProps
} & Omit<Parameters<typeof ConfirmationDialog>[0], 'open' | 'onCancel'>) {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleConfirm = () => {
        handleClose()
        onConfirm()
    }

    return (
        <>
            <Button
                onClick={shouldConfirm ? handleOpen : handleConfirm}
                color={props.color}
                {...buttonProps}
            />

            <ConfirmationDialog
                open={open}
                onCancel={handleClose}
                onConfirm={handleConfirm}
                confirmButtonProps={confirmButtonProps}
                {...props}
            />
        </>
    )
}
