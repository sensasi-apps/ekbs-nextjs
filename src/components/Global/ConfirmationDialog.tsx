import { memo } from 'react'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

const ConfirmationDialog = memo(function ConfirmationDialog({
    open,
    title,
    content,
    onConfirm,
    onCancel,
}: {
    open: boolean
    title: string
    content?: string
    onConfirm: () => void
    onCancel: () => void
}) {
    return (
        <Dialog open={open}>
            <DialogTitle bgcolor="warning.main" color="warning.contrastText">
                {title}
            </DialogTitle>
            {content && (
                <DialogContent>
                    <Box pt={2}>{content}</Box>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={onCancel} color="warning">
                    Urungkan
                </Button>
                <Button onClick={onConfirm} color="warning" variant="contained">
                    Yakin
                </Button>
            </DialogActions>
        </Dialog>
    )
})

export default ConfirmationDialog
