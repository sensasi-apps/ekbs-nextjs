// vendors
import type { UUID } from 'crypto'
import { useState } from 'react'
import { mutate } from 'swr'
import { PatternFormat } from 'react-number-format'
import axios from '@/lib/axios'
// materials
import Box, { type BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
// components
import type UserSocial from '@/features/user/types/user-social'
import SocialForm from '../Social/Form'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

const GET_ICON_NODE = (name: string) => {
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

const ContactListItem = ({
    data: { uuid, username, social, user_uuid },
    readMode,
}: {
    data: UserSocial
    readMode?: boolean
}) => {
    const [isDeleting, setIsDeleting] = useState(false)

    if (isDeleting) return <LoadingCenter />

    const handleDelete = async () => {
        setIsDeleting(true)

        await axios.delete(`/users/${user_uuid}/socials/${uuid}`)
        await mutate(`users/${user_uuid}`)

        setIsDeleting(false)
    }

    return (
        <ListItem
            disablePadding
            secondaryAction={
                readMode ? null : (
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                )
            }>
            <ListItemIcon>
                <IconButton
                    href={`${social.url_prefix || ''}${username || ''}
                        ${social.url_suffix || ''}`}
                    target="_blank">
                    {GET_ICON_NODE(social.name)}
                </IconButton>
            </ListItemIcon>
            <ListItemText
                primary={
                    ['phone', 'whatsapp'].includes(
                        social.name.toLowerCase(),
                    ) ? (
                        <PatternFormat
                            value={username}
                            format="+## ###-####-####"
                            displayType="text"
                        />
                    ) : (
                        username
                    )
                }
                secondary={social.name}
            />
        </ListItem>
    )
}

export function ContactList({
    data: socials = [],
    readMode = false,
}: {
    data: UserSocial[]
    readMode?: boolean
}) {
    if (socials.length === 0)
        return (
            <Typography variant="body2" color="GrayText">
                <i>Belum ada data kontak</i>
            </Typography>
        )

    return (
        <List>
            {socials.map(social => (
                <ContactListItem
                    key={social.uuid}
                    data={social}
                    readMode={readMode}
                />
            ))}
        </List>
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
        </div>
    </Box>
)

const UserSocialsCrudBox = ({
    userUuid,
    data: socials = [],
    readMode = false,
    isLoading,
    ...props
}: {
    userUuid: UUID
    data: UserSocial[]
    readMode?: boolean
    isLoading?: boolean
} & BoxProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <Box {...props}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" component="div">
                    Kontak
                </Typography>

                {!readMode && (
                    <IconButton
                        color="success"
                        disabled={isLoading}
                        onClick={() => setIsFormOpen(true)}>
                        <AddIcon />
                    </IconButton>
                )}
            </Box>

            {isLoading &&
                [null, null, null].map((_, i) => <Skeletons key={i} />)}
            {!isLoading && <ContactList data={socials} />}

            <SocialForm
                userUuid={userUuid}
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </Box>
    )
}

export default UserSocialsCrudBox
