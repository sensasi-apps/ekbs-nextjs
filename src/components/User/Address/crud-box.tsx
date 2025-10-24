import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import HomeIcon from '@mui/icons-material/Home'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { mutate } from 'swr'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import axios from '@/lib/axios'
import type UserAddressORM from '@/modules/user/types/orms/user-address'
import AddressForm from './Form'

const AddressListItem = ({
    data: { name, address, uuid: userAddressUuid },
    userUuid,
}: {
    data: UserAddressORM
    userUuid: string
}) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const { province, regency, district, village } = address

    const handleDelete = async () => {
        setIsDeleting(true)

        await axios.delete(`/users/${userUuid}/addresses/${userAddressUuid}`)
        await mutate(`users/${userUuid}`)

        setIsDeleting(false)
    }

    if (isDeleting) return <LoadingCenter />

    return (
        <ListItem
            disablePadding
            secondaryAction={
                <IconButton
                    aria-label="delete"
                    edge="end"
                    onClick={handleDelete}>
                    <DeleteIcon />
                </IconButton>
            }>
            <ListItemAvatar>
                <Avatar>
                    <HomeIcon />
                </Avatar>
            </ListItemAvatar>

            <ListItemText disableTypography>
                <Typography color="GrayText" gutterBottom>
                    {name}
                </Typography>
                <Typography gutterBottom>{address.detail}</Typography>
                <Typography component="p" variant="caption">
                    {province.name}, {regency.name}
                    {district ? `, ${district.name}` : ''}
                    {village ? `, ${village.name}` : ''}
                </Typography>
                <Typography component="p" variant="caption">
                    {address.zip_code}
                </Typography>
            </ListItemText>
        </ListItem>
    )
}

const Skeletons = () => (
    <Box alignItems="center" display="flex" gap={2} mb={1}>
        <div>
            <Skeleton height="3em" variant="circular" width="3em" />
        </div>
        <div>
            <Skeleton width="4em" />
            <Skeleton width="14em" />
            <Skeleton width="15em" />
        </div>
    </Box>
)

export default function UserAddressesCrudBox({
    userUuid,
    data: userAddresses = [],
    isLoading,
    ...props
}: {
    userUuid: string
    data: UserAddressORM[]
    isLoading: boolean
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box {...props}>
            <Box alignItems="center" display="flex">
                <Typography component="div" variant="h6">
                    Alamat
                </Typography>

                <IconButton
                    color="success"
                    disabled={isLoading}
                    onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {isLoading &&
                [null, null, null].map((_, i) => <Skeletons key={i} />)}

            {!isLoading && userAddresses.length === 0 && (
                <Typography color="GrayText" variant="body2">
                    <i>Belum ada data alamat</i>
                </Typography>
            )}

            {!isLoading && userAddresses.length > 0 && (
                <List>
                    {userAddresses.map(userAddress => (
                        <AddressListItem
                            data={userAddress}
                            key={userAddress.uuid}
                            userUuid={userUuid}
                        />
                    ))}
                </List>
            )}

            <AddressForm
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                userUuid={userUuid}
            />
        </Box>
    )
}
