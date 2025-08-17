// vendors
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
// icons-materials
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
// components
import UserDetailForm from './Form'
// providers
import useUserWithDetails from '@/app/(auth)/systems/users/[[...uuid]]/_parts/user-with-details-provider'
import useFormData from '@/providers/FormData'

export default function UserDetailDialogFormWithButton() {
    const { data: { detail } = {} } = useUserWithDetails()
    const { isDataNotUndefined, handleEdit, handleClose } = useFormData()

    const handleEditClick = () => handleEdit(detail || {})

    return (
        <>
            <Button
                color="info"
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditClick}>
                Perbaharui detail pengguna
            </Button>

            <Dialog maxWidth="sm" open={isDataNotUndefined}>
                <DialogTitle display="flex" justifyContent="space-between">
                    Perbaharui detail pengguna
                    <IconButton size="small" onClick={() => handleClose()}>
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
