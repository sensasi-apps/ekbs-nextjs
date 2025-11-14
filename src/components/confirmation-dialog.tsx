// vendors

// materials
import Box from '@mui/material/Box'
import Button, { type ButtonProps } from '@mui/material/Button'
import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

function ConfirmationDialog({
    color = 'warning',
    loading,
    title,
    onConfirm,
    onCancel,
    cancelButtonProps,
    confirmButtonProps,
    children,
    ...props
}: ConfirmationDialogWithButtonProps) {
    return (
        <Dialog disableRestoreFocus fullWidth maxWidth="xs" {...props}>
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
                <Button
                    color={color}
                    loading={loading}
                    onClick={onCancel}
                    {...cancelButtonProps}>
                    Urungkan
                </Button>

                <Button
                    color={color}
                    loading={loading}
                    onClick={onConfirm}
                    variant="contained"
                    {...confirmButtonProps}>
                    Yakin
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog

interface ConfirmationDialogWithButtonProps extends DialogProps {
    color?: ButtonProps['color']
    loading?: ButtonProps['loading']
    title: string
    onConfirm: ButtonProps['onClick']
    onCancel: () => void
    cancelButtonProps?: ButtonProps
    confirmButtonProps?: ButtonProps
}
