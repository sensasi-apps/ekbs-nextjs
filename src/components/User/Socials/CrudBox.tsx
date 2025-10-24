// vendors

// icons
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
// materials
import Box, { type BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import type { UUID } from 'crypto'
import { useState } from 'react'
import { PatternFormat } from 'react-number-format'
import { mutate } from 'swr'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import axios from '@/lib/axios'
// components
import type UserSocial from '@/modules/user/types/orms/user-social'
import SocialForm from '../Social/Form'

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
                        aria-label="delete"
                        edge="end"
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
                            displayType="text"
                            format="+## &nbsp;###–####–####"
                            value={username}
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
            <Typography color="GrayText" variant="body2">
                <i>Belum ada data kontak</i>
            </Typography>
        )

    return (
        <List>
            {socials.map(social => (
                <ContactListItem
                    data={social}
                    key={social.uuid}
                    readMode={readMode}
                />
            ))}
        </List>
    )
}

const Skeletons = () => (
    <Box alignItems="center" display="flex" gap={2} mb={1}>
        <div>
            <Skeleton height="3em" variant="circular" width="3em" />
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
            <Box alignItems="center" display="flex">
                <Typography component="div" variant="h6">
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
                isShow={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                userUuid={userUuid}
            />
        </Box>
    )
}

export default UserSocialsCrudBox
