// vendors

import CloseIcon from '@mui/icons-material/Close'
// icons-materials
import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
// providers
import useFormData from '@/providers/FormData'
// components
import UserDetailForm from './Form'

export default function UserDetailDialogFormWithButton() {
    const { data: { detail } = {} } = useUserDetailSwr()
    const { isDataNotUndefined, handleEdit, handleClose } = useFormData()

    const handleEditClick = () => handleEdit(detail ?? {})

    return (
        <>
            <Button
                color="info"
                onClick={handleEditClick}
                size="small"
                startIcon={<EditIcon />}
                variant="outlined">
                Perbaharui detail pengguna
            </Button>

            <Dialog maxWidth="sm" open={isDataNotUndefined}>
                <DialogTitle display="flex" justifyContent="space-between">
                    Perbaharui detail pengguna
                    <IconButton onClick={() => handleClose()} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <UserDetailForm />
                </DialogContent>
            </Dialog>
        </>
    )
}
