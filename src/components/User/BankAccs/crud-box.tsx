import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { mutate } from 'swr'
import LoadingCenter from '@/components/statuses/loading-center'
import axios from '@/lib/axios'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
import type UserBankAccountORM from '@/modules/user/types/orms/user-bank-account'
//
import UserBankAccForm from './form'

function ListItem({
    data: { uuid, no_decrypted, name },
    userUuid,
}: {
    data: UserBankAccountORM
    userUuid: string
}) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        await axios.delete(`/users/${userUuid}/bank-accs/${uuid}`)
        await mutate(`users/${userUuid}`)
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
                            aria-label="copy"
                            edge="end"
                            onClick={() =>
                                navigator.clipboard.writeText(no_decrypted)
                            }
                            size="large">
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                </>
            }>
            <ListItemText primary={no_decrypted} secondary={name} />
        </MuiListItem>
    )
}

export default function UserBankAccsCrudBox() {
    const { data: userWithDetails, isLoading } = useUserDetailSwr()

    const [isFormOpen, setIsFormOpen] = useState(false)

    const { bank_accs, uuid: userUuid } = (userWithDetails ?? {}) as {
        bank_accs: UserBankAccountORM[]
        uuid: string
    }

    return (
        <Box>
            <Box alignItems="center" display="flex">
                <Typography component="div" variant="h6">
                    Rekening Bank
                </Typography>

                <IconButton
                    color="success"
                    disabled={isLoading}
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
                <Typography color="GrayText" variant="body2">
                    <i>Belum ada data rekening</i>
                </Typography>
            )}

            {!isLoading && bank_accs?.length > 0 && (
                <List>
                    {bank_accs.map(bankAcc => (
                        <ListItem
                            data={bankAcc}
                            key={bankAcc.uuid}
                            userUuid={userUuid}
                        />
                    ))}
                </List>
            )}

            <UserBankAccForm
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                userUuid={userUuid}
            />
        </Box>
    )
}
