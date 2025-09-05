import Button from '@mui/material/Button'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

import EditIcon from '@mui/icons-material/Edit'

import useFormData, { FormDataProvider } from '@/providers/FormData'

import MemberForm from './Form'
import MemberBox from './box'
import useUserWithDetails from '@/app/(auth)/systems/users/[[...uuid]]/_parts/user-with-details-provider'
import { getRoleIconByIdName } from '../RoleChips'

const DialogForm = () => {
    const { isDataNotUndefined } = useFormData()

    return (
        <Dialog open={isDataNotUndefined} maxWidth="xs">
            <DialogTitle>Keanggotaan</DialogTitle>
            <DialogContent>
                <MemberForm />
            </DialogContent>
        </Dialog>
    )
}

const EditButton = () => {
    const { data } = useUserWithDetails()
    const { member } = data || {}
    const { handleEdit } = useFormData()
    const handleEditClick = () => handleEdit(member)

    return (
        <Button
            color="info"
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditClick}>
            Perbaharui data keanggotaan
        </Button>
    )
}

export default function UserMemberCrudCard() {
    return (
        <Card>
            <CardHeader
                avatar={getRoleIconByIdName('anggota')}
                title="Keanggotaan"
                slotProps={{
                    title: {
                        variant: 'body1',
                        fontWeight: 'bold',
                    },
                }}
            />
            <CardContent sx={{ pt: 0 }}>
                <FormDataProvider>
                    <MemberBox />
                    <EditButton />
                    <DialogForm />
                </FormDataProvider>
            </CardContent>
        </Card>
    )
}
