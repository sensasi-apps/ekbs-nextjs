import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
import useFormData, { FormDataProvider } from '@/providers/FormData'
import { getRoleIconByIdName } from '../RoleChips'
import MemberBox from './box'
import MemberForm from './Form'

const DialogForm = () => {
    const { isDataNotUndefined } = useFormData()

    return (
        <Dialog maxWidth="xs" open={isDataNotUndefined}>
            <DialogTitle>Keanggotaan</DialogTitle>
            <DialogContent>
                <MemberForm />
            </DialogContent>
        </Dialog>
    )
}

const EditButton = () => {
    const { data } = useUserDetailSwr()
    const { member } = data ?? {}
    const { handleEdit } = useFormData()
    const handleEditClick = () => handleEdit(member)

    return (
        <Button
            color="info"
            onClick={handleEditClick}
            size="small"
            startIcon={<EditIcon />}
            variant="outlined">
            Perbaharui data keanggotaan
        </Button>
    )
}

export default function UserMemberCrudCard() {
    return (
        <Card>
            <CardHeader
                avatar={getRoleIconByIdName('anggota')}
                slotProps={{
                    title: {
                        fontWeight: 'bold',
                        variant: 'body1',
                    },
                }}
                title="Keanggotaan"
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
