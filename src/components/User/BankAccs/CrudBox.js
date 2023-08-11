import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import UserBankAccForm from './Form'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import useUserWithDetails from '@/providers/UserWithDetails'

const ListItem = ({ data: { uuid, no_decrypted, name }, userUuid }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        await axios.delete(`/users/${userUuid}/bank-accs/${uuid}`)
        await mutate(`/users/${userUuid}`)
        setIsDeleting(false)
    }

    if (isDeleting) return <LoadingCenter />

    return (
        <MuiListItem
            disablePadding
            secondaryAction={
                <>
                    <IconButton
                        aria-label="delete"
                        onClick={handleDelete}
                        size="small"
                        sx={{ mr: 4 }}>
                        <DeleteIcon />
                    </IconButton>
                    <Tooltip title="Salin">
                        <IconButton
                            edge="end"
                            size="large"
                            aria-label="copy"
                            onClick={() =>
                                navigator.clipboard.writeText(no_decrypted)
                            }>
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                </>
            }>
            <ListItemText primary={no_decrypted} secondary={name} />
        </MuiListItem>
    )
}

const UserBankAccsCrudBox = () => {
    const { data: userWithDetails, isLoading } = useUserWithDetails()

    const [isFormOpen, setIsFormOpen] = useState(false)

    const { bank_accs, uuid: userUuid } = userWithDetails || {}

    return (
        <Box>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Rekening Bank
                </Typography>

                <IconButton
                    disabled={isLoading}
                    color="success"
                    onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {isLoading && (
                <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </>
            )}

            {!isLoading && bank_accs?.length === 0 && (
                <Typography variant="body2" color="GrayText">
                    <i>Belum ada data rekening</i>
                </Typography>
            )}

            {!isLoading && bank_accs?.length > 0 && (
                <List>
                    {bank_accs.map(bankAcc => (
                        <ListItem
                            key={bankAcc.uuid}
                            data={bankAcc}
                            userUuid={userUuid}
                        />
                    ))}
                </List>
            )}

            <UserBankAccForm
                userUuid={userUuid}
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </Box>
    )
}

export default UserBankAccsCrudBox
