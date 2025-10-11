'use client'

// vendors
import { useState } from 'react'
// materials
import Button, { type ButtonProps } from '@mui/material/Button'
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
