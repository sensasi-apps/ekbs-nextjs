import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { mutate } from 'swr'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import axios from '@/lib/axios'
import type VehicleORM from '@/types/orms/vehicle'
import UserVehicleForm from '../Vehicle/form'

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
                    alignItems="center"
                    component="p"
                    display="flex"
                    variant="h6">
                    {type}
                    <Typography
                        color="GrayText"
                        component="span"
                        ml={1}
                        variant="body2">
                        {max_capacity_ton} TON
                    </Typography>
                </Typography>

                <Typography color="GrayText" component="p" variant="body2">
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
            <Box alignItems="center" display="flex">
                <Typography component="div" variant="h6">
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
                <Typography color="GrayText" variant="body2">
                    <i>Belum ada data kendaraan</i>
                </Typography>
            )}

            {vehicles.length > 0 && (
                <List>
                    {vehicles.map(vehicle => (
                        <ListItem
                            courierUserUuid={courierUserUuid}
                            data={vehicle}
                            key={vehicle.uuid}
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
