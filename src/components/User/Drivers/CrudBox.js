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
import UserDriverForm from '../Driver/Form'

const ListItem = ({
    courierUserUuid,
    data: {
        uuid: driverUuid,
        id,
        name,
        driver: { license_number },
    },
}) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        await axios.delete(
            `/users/${courierUserUuid}/courier/drivers/${driverUuid}`,
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

const UserDriversCrudBox = ({ courierUserUuid, data: drivers = [] }) => {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
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
                <Typography variant="body2" color="GrayText">
                    <i>Belum ada data pengemudi</i>
                </Typography>
            )}

            {drivers.length > 0 && (
                <List disablePadding>
                    {drivers.map(driver => (
                        <ListItem
                            key={driver.uuid}
                            courierUserUuid={courierUserUuid}
                            data={driver}
                        />
                    ))}
                </List>
            )}

            <Fade
                in={isFormOpen}
                unmountOnExit
                style={{
                    marginTop: 16,
                }}>
                <UserDriverForm
                    courierUserUuid={courierUserUuid}
                    onClose={() => setIsFormOpen(false)}
                />
            </Fade>
        </Box>
    )
}

export default UserDriversCrudBox
