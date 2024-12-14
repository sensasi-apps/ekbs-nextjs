import { mutate } from 'swr'
import { useState } from 'react'
import axios from '@/lib/axios'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import HomeIcon from '@mui/icons-material/Home'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import AddressForm from './Form'

const AddressListItem = ({
    data: { name, address, uuid: userAddressUuid },
    userUuid,
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

const Skeletons = () => (
    <Box display="flex" alignItems="center" gap={2} mb={1}>
        <div>
            <Skeleton variant="circular" width="3em" height="3em" />
        </div>
        <div>
            <Skeleton width="4em" />
            <Skeleton width="14em" />
            <Skeleton width="15em" />
        </div>
    </Box>
)

const UserAddressesCrudBox = ({
    userUuid,
    data: userAddresses = [],
    isLoading,
    ...props
}) => {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box {...props}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
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
                <Typography variant="body2" color="GrayText">
                    <i>Belum ada data alamat</i>
                </Typography>
            )}

            {!isLoading && userAddresses.length > 0 && (
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

export default UserAddressesCrudBox
