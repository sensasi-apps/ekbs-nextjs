import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import EditIcon from '@mui/icons-material/Edit'

import UserDetailForm from './Form'

import useUserWithDetails from '@/providers/UserWithDetails'
import useFormData from '@/providers/FormData'

const UserDetailDialogFormWithButton = () => {
    const { data } = useUserWithDetails()
    const { isDataNotUndefined, handleEdit } = useFormData()

    const handleEditClick = () => handleEdit(data.detail)

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
                <DialogTitle>Perbaharui detail pengguna</DialogTitle>
                <DialogContent>
                    <UserDetailForm />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UserDetailDialogFormWithButton
