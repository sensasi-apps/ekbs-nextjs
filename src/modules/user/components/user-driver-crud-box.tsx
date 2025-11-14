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
import LoadingCenter from '@/components/statuses/loading-center'
import UserDriverForm from '@/components/User/Driver/Form'
import axios from '@/lib/axios'
import type UserORM from '../types/orms/user'

function ListItem({
    courierUserUuid,
    data: { uuid: driverUuid, id, name, driver },
}: {
    courierUserUuid: string
    data: UserORM
}) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        await axios.delete(
            `/users/${courierUserUuid}/courier/drivers/${driverUuid}`,
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
                    {name}
                    <Typography
                        color="GrayText"
                        component="span"
                        ml={1}
                        variant="body2">
                        #{id}
                    </Typography>
                </Typography>

                <Typography color="GrayText" component="p" variant="body2">
                    {driver?.license_number}
                </Typography>
            </ListItemText>
        </MuiListItem>
    )
}

export default function UserDriversCrudBox({
    courierUserUuid,
    data: drivers,
}: {
    courierUserUuid: string
    data: UserORM[]
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box>
            <Box alignItems="center" display="flex">
                <Typography component="div" variant="h6">
                    Pengemudi
                </Typography>

                <IconButton
                    color="success"
                    disabled={isFormOpen}
                    onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {drivers.length === 0 && !isFormOpen && (
                <Typography color="GrayText" variant="body2">
                    <i>Belum ada data pengemudi</i>
                </Typography>
            )}

            {drivers.length > 0 && (
                <List disablePadding>
                    {drivers.map(driver => (
                        <ListItem
                            courierUserUuid={courierUserUuid}
                            data={driver}
                            key={driver.uuid}
                        />
                    ))}
                </List>
            )}

            <Fade
                in={isFormOpen}
                unmountOnExit
                // style={{
                //     marginTop: 16,
                // }}
            >
                <span>
                    <UserDriverForm
                        courierUserUuid={courierUserUuid}
                        onClose={() => setIsFormOpen(false)}
                    />
                </span>
            </Fade>
        </Box>
    )
}
