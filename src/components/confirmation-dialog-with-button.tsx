'use client'

// materials
import Button, { type ButtonProps } from '@mui/material/Button'
// vendors
import { useState } from 'react'
// components
import ConfirmationDialog from './confirmation-dialog'

export default function ConfirmationDialogWithButton({
    shouldConfirm,
    onConfirm,
    buttonProps,
    confirmButtonProps,
    ...props
}: ConfirmationDialogWithButtonProps) {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleConfirm = () => {
        onConfirm()
            ?.then(handleClose)
            .catch(() => undefined)
    }

    return (
        <>
            <Button
                color={props.color}
                onClick={shouldConfirm ? handleOpen : handleConfirm}
                {...buttonProps}
            />

            <ConfirmationDialog
                confirmButtonProps={confirmButtonProps}
                onCancel={handleClose}
                onConfirm={handleConfirm}
                open={open}
                {...props}
            />
        </>
    )
}

interface ConfirmationDialogWithButtonProps
    extends Omit<
        Parameters<typeof ConfirmationDialog>[0],
        'open' | 'onCancel'
    > {
    /**
     * If `false`, `onConfirm` will be called immediately and skipping dialog
     */
    shouldConfirm: boolean
    onConfirm: () => void | Promise<unknown>
    buttonProps?: Omit<ButtonProps, 'children'> & {
        children: ButtonProps['children']
    }
    confirmButtonProps?: ButtonProps
}
