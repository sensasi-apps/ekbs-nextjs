import { useState } from 'react'
import { mutate } from 'swr'
import moment from 'moment'
import 'moment/locale/id'

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

import MemberLandForm from '../Land/Form'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

function ListItem({
    data: {
        uuid: landUuuid,
        address,
        rea_land_id,
        planted_at,
        n_area_hectares,
        note,
    },
    userUuid,
}) {
    const { province, regency, district, village } = address

    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        await axios.delete(`/users/${userUuid}/member/lands/${landUuuid}`)
        await mutate(`/users/${userUuid}`)

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
                <Typography gutterBottom variant="h5" component="span">
                    {n_area_hectares} Ha
                </Typography>
                <Typography color="GrayText" gutterBottom>
                    {note}
                </Typography>
                <Typography gutterBottom>{rea_land_id}</Typography>
                <Typography gutterBottom>
                    {planted_at
                        ? moment(planted_at).format('DD MMMM YYYY')
                        : null}
                </Typography>
                <Typography color="GrayText" gutterBottom>
                    {address.detail}
                </Typography>
                <Typography color="GrayText" variant="caption" component="p">
                    {province.name}, {regency.name}
                    {district ? ', ' + district.name : ''}
                    {village ? ', ' + village.name : ''}
                </Typography>
                <Typography color="GrayText" variant="caption" component="p">
                    {address.zip_code}
                </Typography>
            </ListItemText>
        </MuiListItem>
    )
}

export default function MemberLandsBox({
    userUuid,
    data: lands = [],
    ...props
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box {...props}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Kebun
                </Typography>

                <IconButton color="success" onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {lands.length === 0 && (
                <Typography>
                    <i>Belum ada data kebun</i>
                </Typography>
            )}

            {lands.length > 0 && (
                <List disablePadding>
                    {lands.map(land => (
                        <ListItem
                            key={land.uuid}
                            data={land}
                            userUuid={userUuid}
                        />
                    ))}
                </List>
            )}

            <MemberLandForm
                userUuid={userUuid}
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </Box>
    )
}
