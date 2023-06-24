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

const AddressListItem = ({ data: { name, address }, userUuid }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const { province, regency, district, village } = address

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await axios.delete(`/users/addresses/${address.id}`)
            await mutate(`/users/${userUuid}`)
        } catch (err) {
            console.error(err)
        }
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

export default function UserAddressesBox({
    userUuid,
    data: addresses = [],
    ...props
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

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

            {addresses.length === 0 && (
                <Typography>
                    <i>Belum ada data alamat</i>
                </Typography>
            )}

            {addresses.length > 0 && (
                <List>
                    {addresses.map(address => (
                        <AddressListItem
                            key={address.address_id}
                            data={address}
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
