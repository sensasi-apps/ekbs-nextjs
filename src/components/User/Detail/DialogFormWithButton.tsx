// vendors
import {
    Button,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material'
// components
import UserDetailForm from './Form'
// providers
import useUserWithDetails from '@/providers/UserWithDetails'
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
