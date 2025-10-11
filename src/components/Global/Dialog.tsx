// types

// icons
import CloseIcon from '@mui/icons-material/Close'
import type { DialogProps } from '@mui/material/Dialog'
// materials
import MuiDialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import type { DialogTitleProps } from '@mui/material/DialogTitle'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import type { ReactNode } from 'react'

export default function Dialog({
    children,
    closeButtonProps,
    dialogTitleProps,
    middleHead,
    title,
    actions,
    ...props
}: {
    closeButtonProps?: {
        onClick?: () => void
        disabled?: boolean
    }
    dialogTitleProps?: DialogTitleProps
    middleHead?: ReactNode
    title: string
    actions?: ReactNode
} & DialogProps) {
    return (
        <MuiDialog disableRestoreFocus fullWidth maxWidth="xs" {...props}>
            <DialogTitle
                alignItems="center"
                component="div"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                {...dialogTitleProps}>
                {title}

                {middleHead}

                {closeButtonProps?.onClick && (
                    <div>
                        <IconButton
                            disabled={closeButtonProps.disabled}
                            onClick={closeButtonProps.onClick}
                            size="small">
                            <CloseIcon />
                        </IconButton>
                    </div>
                )}
            </DialogTitle>

            <DialogContent>{children}</DialogContent>

            {actions && <DialogActions>{actions}</DialogActions>}
        </MuiDialog>
    )
}
