// types
import type { ReactNode } from 'react'
import type { DialogProps } from '@mui/material/Dialog'
// vendors
import { memo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

/**
 * A dialog component with a title and content.
 * @default
 * - fullWidth
 * - maxWidth: 'xs'
 * - disableRestoreFocus
 * @param {string} title - The title of the dialog.
 * @param {ReactNode} children - The content of the dialog.
 * @param {DialogProps} props - Additional props for the Dialog component.
 */
const DialogWithTitle = memo(function DialogWithTitle({
    title,
    children,
    ...props
}: {
    title: string
    children: ReactNode
} & DialogProps) {
    return (
        <Dialog fullWidth maxWidth="xs" disableRestoreFocus {...props}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    )
})

export default DialogWithTitle
