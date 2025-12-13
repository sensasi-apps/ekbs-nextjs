'use client'

// materials
import Button, { type ButtonProps } from '@mui/material/Button'
// vendors
import { useState } from 'react'
// components
import ConfirmationDialog from './confirmation-dialog'
import TopLinearProgress from './top-linear-progress'

export default function ConfirmationDialogWithButton({
    shouldConfirm,
    onConfirm,
    buttonText,
    buttonProps,
    confirmButtonProps,
    color = 'warning',
    children,
    ...props
}: ConfirmationDialogWithButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleConfirm = () => {
        setLoading(true)

        onConfirm()
            ?.then(handleClose)
            .catch(() => undefined)
            .finally(() => setLoading(false))
    }

    return (
        <>
            <Button
                color={color}
                onClick={shouldConfirm ? handleOpen : handleConfirm}
                {...buttonProps}>
                {buttonText}
            </Button>

            <ConfirmationDialog
                color={color}
                confirmButtonProps={confirmButtonProps}
                onCancel={handleClose}
                onConfirm={handleConfirm}
                open={open}
                {...props}>
                <TopLinearProgress show={loading} />

                {children}
            </ConfirmationDialog>
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

    /**
     * Return a {@link Promise} to handle auto close
     */
    onConfirm: () => void | Promise<unknown>

    buttonProps?: Omit<ButtonProps, 'children'>

    confirmButtonProps?: ButtonProps

    buttonText: ButtonProps['children']
}
