// vendors
import { memo } from 'react'
// materials
import Box from '@mui/material/Box'
import Button, { type ButtonProps } from '@mui/material/Button'
import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

const ConfirmationDialog = memo(function ConfirmationDialog({
    color = 'warning',
    title,
    onConfirm,
    onCancel,
    cancelButtonProps,
    confirmButtonProps,
    children,
    ...props
}: {
    color?: ButtonProps['color']
    title: string
    onConfirm: ButtonProps['onClick']
    onCancel: () => void
    cancelButtonProps?: ButtonProps
    confirmButtonProps?: ButtonProps
} & DialogProps) {
    return (
        <Dialog maxWidth="xs" fullWidth disableRestoreFocus {...props}>
            <DialogTitle
                bgcolor={`${color}.main`}
                color={`${color}.contrastText`}>
                {title}
            </DialogTitle>
            {children && (
                <DialogContent>
                    <Box pt={2}>{children}</Box>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={onCancel} color={color} {...cancelButtonProps}>
                    Urungkan
                </Button>
                <Button
                    onClick={onConfirm}
                    color={color}
                    variant="contained"
                    {...confirmButtonProps}>
                    Yakin
                </Button>
            </DialogActions>
        </Dialog>
    )
})

export default ConfirmationDialog
