import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import {
    IconButton,
    List,
    ListItem as MuiListItem,
    ListItemText,
    Tooltip,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import UserBankAccForm from './Form'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

function ListItem({ data: { uuid, no_decrypted, name }, userUuid }) {
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
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                    <Tooltip title="Salin">
                        <IconButton
                            edge="end"
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

export default function UserBankAccsBox({
    userUuid,
    data: bankAccs = [],
    ...props
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box {...props}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Rekening Bank
                </Typography>

                <IconButton color="success" onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {bankAccs.length === 0 && (
                <Typography>
                    <i>Belum ada data rekening</i>
                </Typography>
            )}

            {bankAccs.length > 0 && (
                <List>
                    {bankAccs.map(bankAcc => (
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
