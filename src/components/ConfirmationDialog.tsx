// types
import type { DialogProps } from '@mui/material/Dialog'
import type { LoadingButtonProps } from '@mui/lab/LoadingButton'
// vendors
import { memo } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import LoadingButton from '@mui/lab/LoadingButton'

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
    color?: LoadingButtonProps['color']
    title: string
    onConfirm: LoadingButtonProps['onClick']
    onCancel: () => void
    cancelButtonProps?: LoadingButtonProps
    confirmButtonProps?: LoadingButtonProps
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
                <LoadingButton
                    onClick={onCancel}
                    color={color}
                    {...cancelButtonProps}>
                    Urungkan
                </LoadingButton>
                <LoadingButton
                    onClick={onConfirm}
                    color={color}
                    variant="contained"
                    {...confirmButtonProps}>
                    Yakin
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
})

export default ConfirmationDialog
