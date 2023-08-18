import { FC } from 'react'

import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'

import CloseIcon from '@mui/icons-material/Close'

interface DialogProps extends MuiDialogProps {
    title: string
    onCloseButtonClick?: () => void
    isCloseDisabled?: boolean
}

const Dialog: FC<DialogProps> = ({
    title,
    onCloseButtonClick,
    isCloseDisabled,
    children,
    ...props
}) => {
    return (
        <MuiDialog maxWidth="xs" {...props}>
            <DialogTitle display="flex" justifyContent="space-between">
                {title}

                {onCloseButtonClick && (
                    <IconButton
                        size="small"
                        disabled={isCloseDisabled}
                        onClick={onCloseButtonClick}>
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent> {children} </DialogContent>
        </MuiDialog>
    )
}

export default Dialog
