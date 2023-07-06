import { mutate } from 'swr'
import { useState } from 'react'
import axios from '@/lib/axios'

import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import HomeIcon from '@mui/icons-material/Home'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import AddressForm from './Form'

export default function UserAddressesBox({
    userUuid,
    data: userAddresses = [],
    ...props
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    const AddressListItem = ({
        data: { name, address, uuid: userAddressUuid },
        userUuid,
    }) => {
        const [isDeleting, setIsDeleting] = useState(false)

        const { province, regency, district, village } = address

        const handleDelete = async () => {
            setIsDeleting(true)

            await axios.delete(
                `/users/${userUuid}/addresses/${userAddressUuid}`,
            )
            await mutate(`/users/${userUuid}`)

            setIsDeleting(false)
        }

        if (isDeleting) return <LoadingCenter />

        return (
            <ListItem
                disablePadding
                secondaryAction={
                    <IconButton
                        edge="end"
                        aria-label="delete"
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
                    <Typography variant="caption" component="p">
                        {province.name}, {regency.name}
                        {district ? ', ' + district.name : ''}
                        {village ? ', ' + village.name : ''}
                    </Typography>
                    <Typography variant="caption" component="p">
                        {address.zip_code}
                    </Typography>
                </ListItemText>
            </ListItem>
        )
    }

    return (
        <Box {...props}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Alamat
                </Typography>

                <IconButton color="success" onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {userAddresses.length === 0 && (
                <Typography>
                    <i>Belum ada data alamat</i>
                </Typography>
            )}

            {userAddresses.length > 0 && (
                <List>
                    {userAddresses.map(userAddress => (
                        <AddressListItem
                            key={userAddress.uuid}
                            data={userAddress}
                            userUuid={userUuid}
                        />
                    ))}
                </List>
            )}

            <AddressForm
                userUuid={userUuid}
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </Box>
    )
}
