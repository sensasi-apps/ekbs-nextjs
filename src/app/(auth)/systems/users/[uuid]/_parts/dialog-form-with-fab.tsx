import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fab from '@mui/material/Fab'

import PersonAddIcon from '@mui/icons-material/PersonAdd'

import UserForm from '@/app/(auth)/systems/users/[uuid]/_parts/user-form'

import useFormData from '@/providers/FormData'

export default function UserDialogFormWithFab() {
    const { handleCreate, isDataNotUndefined, isNew } = useFormData()

    const text = isNew ? 'Buat akun baru' : 'Perbarui data akun'

    return (
        <>
            <Dialog maxWidth="xs" open={isDataNotUndefined}>
                <DialogTitle>{text}</DialogTitle>
                <DialogContent>
                    <UserForm />
                </DialogContent>
            </Dialog>

            <Box position="fixed" bottom={16} right={16} zIndex={1}>
                <Fab
                    disabled={isDataNotUndefined}
                    onClick={() => {
                        handleCreate()
                    }}
                    color="success"
                    aria-label={text}>
                    <PersonAddIcon />
                </Fab>
            </Box>
        </>
    )
}
