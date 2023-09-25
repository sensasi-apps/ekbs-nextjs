import { FC } from 'react'

import MuiDialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'

import CloseIcon from '@mui/icons-material/Close'

const Dialog: FC<DialogProps> = ({
    children,
    closeButtonProps,
    dialogTitleProps,
    middleHead,
    title,
    ...props
}) => {
    return (
        <MuiDialog maxWidth="xs" {...props}>
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

export default Dialog

import type { ReactNode } from 'react'
import type { DialogProps as MuiDialogProps } from '@mui/material/Dialog'
import type { DialogTitleProps } from '@mui/material/DialogTitle'

interface DialogProps extends MuiDialogProps {
    closeButtonProps?: {
        onClick?: () => void
        disabled?: boolean
    }
    dialogTitleProps?: DialogTitleProps
    middleHead?: ReactNode
    title: string
}

export type { DialogProps }
