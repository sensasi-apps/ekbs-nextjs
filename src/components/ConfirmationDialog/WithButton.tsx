// types
import type { LoadingButtonProps } from '@mui/lab/LoadingButton'
// vendors
import { useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
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
    buttonProps?: LoadingButtonProps
    confirmButtonProps?: LoadingButtonProps
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
            <LoadingButton
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
