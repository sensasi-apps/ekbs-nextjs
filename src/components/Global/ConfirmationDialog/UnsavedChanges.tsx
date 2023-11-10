import { useState } from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import ConfirmationDialog from '../ConfirmationDialog'

export default function UnsavedChangesConfirmationButtonAndDialog({
    shouldConfirm = true,
    onConfirm,
    buttonProps,
}: {
    shouldConfirm: boolean
    onConfirm: () => void
    buttonProps?: ButtonProps
}) {
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
                type="reset"
                color="info"
                {...buttonProps}>
                Batal
            </Button>

            <ConfirmationDialog
                title="Anda yakin ingin membatalkan perubahan?"
                content="Perubahan yang belum disimpan akan hilang."
                open={open}
                onConfirm={handleConfirm}
                onCancel={handleClose}
            />
        </>
    )
}
