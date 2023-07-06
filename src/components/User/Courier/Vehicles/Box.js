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
import CourierVehicleForm from '../Vehicle/Form'

export default function CourierVehiclesBox({
    courierUserUuid,
    data: vehicles = [],
    ...props
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    function ListItem({
        data: {
            uuid: vehicleUuid,
            brand,
            type,
            max_capacity_ton,
            plate_number,
        },
    }) {
        const [isDeleting, setIsDeleting] = useState(false)

        const handleDelete = async () => {
            setIsDeleting(true)

            await axios.delete(
                `/users/${courierUserUuid}/courier/vehicles/${vehicleUuid}`,
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
                    <Typography
                        variant="h6"
                        component="p"
                        display="flex"
                        alignItems="center">
                        {type}
                        <Typography
                            variant="body2"
                            color="GrayText"
                            component="span"
                            ml={1}>
                            {max_capacity_ton} TON
                        </Typography>
                    </Typography>

                    <Typography variant="body2" color="GrayText" component="p">
                        {brand} | {plate_number}
                    </Typography>
                </ListItemText>
            </MuiListItem>
        )
    }

    return (
        <Box {...props}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Kendaraan
                </Typography>

                <IconButton color="success" onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {vehicles.length === 0 && !isFormOpen && (
                <Typography>
                    <i>Belum ada data kendaraan</i>
                </Typography>
            )}

            {vehicles.length > 0 && (
                <List>
                    {vehicles.map(vehicle => (
                        <ListItem
                            key={vehicle.uuid}
                            data={vehicle}
                            courierUserUuid={courierUserUuid}
                        />
                    ))}
                </List>
            )}

            <CourierVehicleForm
                courierUserUuid={courierUserUuid}
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </Box>
    )
}
