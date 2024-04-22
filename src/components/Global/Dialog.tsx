// types
import type { DialogProps } from '@mui/material/Dialog'
import type { ReactNode } from 'react'
import type { DialogTitleProps } from '@mui/material/DialogTitle'
// materials
import MuiDialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
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
        <MuiDialog fullWidth maxWidth="xs" disableRestoreFocus {...props}>
            <DialogTitle
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                component="div"
                flexWrap="wrap"
                {...dialogTitleProps}>
                {title}

                {middleHead}

                {closeButtonProps?.onClick && (
                    <div>
                        <IconButton
                            size="small"
                            disabled={closeButtonProps.disabled}
                            onClick={closeButtonProps.onClick}>
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
