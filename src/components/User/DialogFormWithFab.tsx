import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fab from '@mui/material/Fab'

import PersonAddIcon from '@mui/icons-material/PersonAdd'

import UserForm from './Form'

import useFormData from '@/providers/FormData'
import useUserWithDetails from '@/providers/UserWithDetails'

const UserDialogFormWithFab = () => {
    const { isLoading } = useUserWithDetails()
    const { handleCreate, isDataNotUndefined, isNew } = useFormData()

    return (
        <>
            <Dialog maxWidth="xs" open={isDataNotUndefined}>
                <DialogTitle>
                    {isNew ? 'Buat akun baru' : 'Perbarui data akun'}
                </DialogTitle>
                <DialogContent>
                    <UserForm />
                </DialogContent>
            </Dialog>

            <Box position="fixed" bottom={16} right={16} zIndex={1}>
                <Fab
                    disabled={isDataNotUndefined || isLoading}
                    onClick={() => {
                        handleCreate()
                    }}
                    color="success"
                    aria-label="buat akun baru">
                    <PersonAddIcon />
                </Fab>
            </Box>
        </>
    )
}

export default UserDialogFormWithFab
