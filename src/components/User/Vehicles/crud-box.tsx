import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import UserVehicleForm from '../Vehicle/form'
import type VehicleORM from '@/types/orms/vehicle'

function ListItem({
    courierUserUuid,
    data: { uuid: vehicleUuid, brand, type, max_capacity_ton, plate_number },
}: {
    courierUserUuid: string
    data: VehicleORM
}) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        await axios.delete(
            `/users/${courierUserUuid}/courier/vehicles/${vehicleUuid}`,
        )
        await mutate(`users/${courierUserUuid}`)

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

export default function UserVehiclesCrudBox({
    courierUserUuid,
    data: vehicles = [],
}: {
    courierUserUuid: string
    data: VehicleORM[]
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Kendaraan
                </Typography>

                <IconButton
                    color="success"
                    disabled={isFormOpen}
                    onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {vehicles.length === 0 && !isFormOpen && (
                <Typography variant="body2" color="GrayText">
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

            <Fade in={isFormOpen} unmountOnExit>
                <div>
                    <UserVehicleForm
                        courierUserUuid={courierUserUuid}
                        onClose={() => setIsFormOpen(false)}
                    />
                </div>
            </Fade>
        </Box>
    )
}
