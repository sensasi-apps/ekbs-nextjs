import { forwardRef } from 'react'

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
import MemberBox from './Box'
import useUserWithDetails from '@/providers/UserWithDetails'
import { getRoleIconByIdName } from '../RoleChips'

const TITLE_TYPORAPHY_PROPS = {
    variant: 'body1',
    fontWeight: 'bold',
}

const PT_0_SX = { pt: 0 }

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
    const { member } = data
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

const UserMemberCrudCard = (props, ref) => {
    return (
        <Card ref={ref} {...props}>
            <CardHeader
                avatar={getRoleIconByIdName('anggota')}
                title="Keanggotaan"
                titleTypographyProps={TITLE_TYPORAPHY_PROPS}
            />
            <CardContent sx={PT_0_SX}>
                <FormDataProvider>
                    <MemberBox />
                    <EditButton />
                    <DialogForm />
                </FormDataProvider>
            </CardContent>
        </Card>
    )
}

export default forwardRef(UserMemberCrudCard)
