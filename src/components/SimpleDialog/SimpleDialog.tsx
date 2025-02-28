// types
import type { DialogProps } from '@mui/material/Dialog'
import type { DialogTitleProps } from '@mui/material/DialogTitle'
import type { IconButtonProps } from '@mui/material/IconButton'
// vendors
import { useState } from 'react'
// materials
import Button, { type ButtonProps } from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
// icons
import CloseIcon from '@mui/icons-material/Close'

/**
 * A simple dialog component that displays a title, content, and a close button. with own open-close button.
 * @param title The title of the dialog.
 * @param children The content of the dialog.
 * @param slotProps The props for the button, close button, and dialog title slots.
 * @param props The props for the Dialog component from Material-UI.
 * @returns A SimpleDialog component.
 */
export default function SimpleDialog({
    title,
    children,
    slotProps,
    ...props
}: {
    title?: string
    slotProps?: {
        buttonProps: ButtonProps
        closeButton?: IconButtonProps
        dialogTitle?: DialogTitleProps
    }
} & Omit<DialogProps, 'open'>) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="small"
                color="info"
                {...slotProps?.buttonProps}
            />

            <Dialog
                fullWidth
                maxWidth="xs"
                disableRestoreFocus
                open={open}
                onClose={() => setOpen(true)}
                {...props}>
                <DialogTitle
                    display="flex"
                    justifyContent="space-between"
                    {...slotProps?.dialogTitle}>
                    {title}

                    <IconButton size="small" onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>{children}</DialogContent>
            </Dialog>
        </>
    )
}
