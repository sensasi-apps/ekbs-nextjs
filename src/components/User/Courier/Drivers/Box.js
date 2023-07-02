import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import {
    IconButton,
    List,
    ListItem as MuiListItem,
    ListItemText,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import CourierDriverForm from '../Driver/Form'

export default function CourierDriversBox({
    courierUserUuid,
    data: drivers = [],
    ...props
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    function ListItem({
        data: {
            user: { id, name },
            license_number,
            user_uuid: driverUserUuid,
        },
        courierUserUuid,
    }) {
        const [isDeleting, setIsDeleting] = useState(false)

        const handleDelete = async () => {
            setIsDeleting(true)

            await axios.delete(
                `/users/couriers/drivers/${courierUserUuid}/${driverUserUuid}`,
            )
            await mutate(`/users/${courierUserUuid}`)

            setIsDeleting(false)
        }

        if (isDeleting) return <LoadingCenter />

        return (
            <MuiListItem
                disablePadding
                secondaryAction={
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                }>
                <ListItemText disableTypography>
                    <Typography variant="h6" component="p">
                        {name}
                        <Typography
                            variant="body2"
                            color="GrayText"
                            component="span"
                            ml={1}>
                            #{id}
                        </Typography>
                    </Typography>

                    <Typography variant="body2" color="GrayText" component="p">
                        {license_number}
                    </Typography>
                </ListItemText>
            </MuiListItem>
        )
    }

    return (
        <Box {...props}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Daftar Pengemudi
                </Typography>

                <IconButton color="success" onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {drivers.length === 0 && !isFormOpen && (
                <Typography>
                    <i>Belum ada data pengemudi</i>
                </Typography>
            )}

            {drivers.length > 0 && (
                <List>
                    {drivers.map(drivers => (
                        <ListItem
                            key={drivers.user_uuid}
                            data={drivers}
                            courierUserUuid={courierUserUuid}
                        />
                    ))}
                </List>
            )}

            <CourierDriverForm
                courierUserUuid={courierUserUuid}
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </Box>
    )
}
