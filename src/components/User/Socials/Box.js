import { useState } from 'react'
import { mutate } from 'swr'

import {
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

import SocialForm from '../Social/Form'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import axios from '@/lib/axios'

const ContactListItem = ({ data: { uuid, username, social }, userUuid }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    if (isDeleting) return <LoadingCenter />

    const handleDelete = async () => {
        setIsDeleting(true)

        await axios.delete(`/users/${userUuid}/socials/${uuid}`)
        await mutate(`/users/${userUuid}`)

        setIsDeleting(false)
    }

    const GET_ICON_NODE = name => {
        switch (name.toLowerCase()) {
            case 'phone':
                return <PhoneIcon color="info" />
            case 'email':
                return <EmailIcon />
            case 'whatsapp':
                return <WhatsAppIcon color="success" />
            case 'instagram':
                return <InstagramIcon color="error" />
            case 'facebook':
                return <FacebookIcon color="info" />
            default:
                return null
        }
    }

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
            <ListItemIcon>
                <IconButton
                    href={`${social.url_prefix || ''}${username || ''}
                    ${social.url_suffix || ''}`}
                    target="_blank">
                    {GET_ICON_NODE(social.name)}
                </IconButton>
            </ListItemIcon>
            <ListItemText primary={username} secondary={social.name} />
        </ListItem>
    )
}

export default function UserSocialsBox({
    userUuid,
    data: socials = [],
    ...props
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box {...props}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Kontak
                </Typography>

                <IconButton color="success" onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {socials.length === 0 && (
                <Typography>
                    <i>Belum ada data kontak</i>
                </Typography>
            )}

            {socials.length > 0 && (
                <List>
                    {socials.map(social => (
                        <ContactListItem
                            key={social.uuid}
                            data={social}
                            userUuid={userUuid}
                        />
                    ))}
                </List>
            )}

            <SocialForm
                userUuid={userUuid}
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </Box>
    )
}
