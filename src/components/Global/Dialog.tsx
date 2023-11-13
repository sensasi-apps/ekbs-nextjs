// types
import type { DialogProps } from '@mui/material/Dialog'
import type { ReactNode } from 'react'
import type { DialogTitleProps } from '@mui/material/DialogTitle'
// materials
import MuiDialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
// icons
import CloseIcon from '@mui/icons-material/Close'

export default function Dialog({
    children,
    closeButtonProps,
    dialogTitleProps,
    middleHead,
    title,
    ...props
}: {
    closeButtonProps?: {
        onClick?: () => void
        disabled?: boolean
    }
    dialogTitleProps?: DialogTitleProps
    middleHead?: ReactNode
    title: string
} & DialogProps) {
    return (
        <MuiDialog fullWidth maxWidth="xs" disableRestoreFocus {...props}>
            <DialogTitle
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                component="div"
                {...dialogTitleProps}>
                {title}

                {middleHead}

                {closeButtonProps?.onClick && (
                    <IconButton
                        size="small"
                        disabled={closeButtonProps.disabled}
                        onClick={closeButtonProps.onClick}>
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
        </MuiDialog>
    )
}
