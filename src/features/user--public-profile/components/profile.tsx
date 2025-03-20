// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
// icons
import MemberIcon from '@mui/icons-material/AccountCircle'
import EmployeeIcon from '@mui/icons-material/AdminPanelSettings'
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
// features
import type Social from '../../user/types/social'
import type PublicProfile from '../types/public-profile'

export default function Profile({ data }: { data: PublicProfile }) {
    const { name } = data

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
            <Typography variant="h4" component="div">
                {name}
            </Typography>

            {/* <Typography variant="body2" component="div">
                SUBTITLE
            </Typography> */}

            <Box sx={{ my: 3, width: 200, height: 200, borderRadius: 100 }}>
                {data.profile_picture_blob ? (
                    <Box
                        sx={{
                            borderRadius: 'inherit',
                            width: '100%',
                            height: '100%',
                            background: `url('data:image/png;base64, ${data.profile_picture_blob}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                ) : (
                    <MemberIcon
                        sx={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                )}
            </Box>

            <Badges data={data} />

            <Box mt={6} display="flex" gap={1}>
                {data.socials?.map(({ social, username }) => (
                    <Tooltip key={social.name} title={social.name}>
                        <IconButton
                            href={`${social.url_prefix ?? ''}${username ?? ''}
                            ${social.url_suffix ?? ''}`}
                            target="_blank">
                            {getSocialIcon(social.name)}
                        </IconButton>
                    </Tooltip>
                ))}
            </Box>
        </Box>
    )
}

function Badges({ data: { member, employee } }: { data: PublicProfile }) {
    return (
        <Box display="flex" gap={1}>
            {member.joined_at && !member.unjoined_at && (
                <Chip label="Anggota" color="warning" icon={<MemberIcon />} />
            )}

            {member.joined_at && member.unjoined_at && (
                <Chip
                    label="Mantan Anggota"
                    color="warning"
                    variant="outlined"
                />
            )}

            {employee.joined_at && !employee.unjoined_at && (
                <Chip
                    label={employee.position ?? 'Karyawan'}
                    color="success"
                    icon={<EmployeeIcon />}
                />
            )}

            {employee.joined_at && employee.unjoined_at && (
                <Chip
                    label="Mantan Karyawan"
                    color="success"
                    variant="outlined"
                />
            )}
        </Box>
    )
}

function getSocialIcon(name: Social['name']) {
    switch (name.toLowerCase()) {
        case 'phone':
            return <PhoneIcon color="info" fontSize="large" />
        case 'email':
            return <EmailIcon fontSize="large" />
        case 'whatsapp':
            return <WhatsAppIcon color="success" fontSize="large" />
        case 'instagram':
            return <InstagramIcon color="error" fontSize="large" />
        case 'facebook':
            return <FacebookIcon color="info" fontSize="large" />
        default:
            return null
    }
}
