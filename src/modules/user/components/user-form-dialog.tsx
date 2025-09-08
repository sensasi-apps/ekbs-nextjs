import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import UserForm from '@/app/(auth)/systems/users/[uuid]/_parts/user-form'

import useFormData from '@/providers/FormData'

export default function UserFormDialog() {
    const { isDataNotUndefined, isNew } = useFormData()

    const text = isNew ? 'Buat akun baru' : 'Perbarui data akun'

    return (
        <Dialog maxWidth="xs" open={isDataNotUndefined}>
            <DialogTitle>{text}</DialogTitle>
            <DialogContent>
                <UserForm />
            </DialogContent>
        </Dialog>
    )
}
