// icons
import CloseIcon from '@mui/icons-material/Close'
// materials
import Button, { type ButtonProps } from '@mui/material/Button'
import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle, { type DialogTitleProps } from '@mui/material/DialogTitle'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
// vendors
import { useState } from 'react'

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
                color="info"
                onClick={() => setOpen(true)}
                size="small"
                {...slotProps?.buttonProps}
            />

            <Dialog
                disableRestoreFocus
                fullWidth
                maxWidth="xs"
                onClose={() => setOpen(true)}
                open={open}
                {...props}>
                <DialogTitle
                    display="flex"
                    justifyContent="space-between"
                    {...slotProps?.dialogTitle}>
                    {title}

                    <IconButton onClick={() => setOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>{children}</DialogContent>
            </Dialog>
        </>
    )
}
