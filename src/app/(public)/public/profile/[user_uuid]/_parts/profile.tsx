// materials

// icons
import MemberIcon from '@mui/icons-material/AccountCircle'
import EmployeeIcon from '@mui/icons-material/AdminPanelSettings'
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// features
import type Social from '@/modules/user/types/orms/social'
import type PublicProfile from '../_types/public-profile'

export default function Profile({ data }: { data: PublicProfile }) {
    const { name } = data

    return (
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Typography component="div" variant="h4">
                {name}
            </Typography>

            {/* <Typography variant="body2" component="div">
                SUBTITLE
            </Typography> */}

            <Box sx={{ borderRadius: 100, height: 200, my: 3, width: 200 }}>
                {data.profile_picture_blob ? (
                    <Box
                        sx={{
                            background: `url('data:image/png;base64, ${data.profile_picture_blob}')`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            borderRadius: 'inherit',
                            height: '100%',
                            width: '100%',
                        }}
                    />
                ) : (
                    <MemberIcon
                        sx={{
                            height: '100%',
                            width: '100%',
                        }}
                    />
                )}
            </Box>

            <Badges data={data} />

            <Box display="flex" gap={1} mt={6}>
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
                <Chip color="warning" icon={<MemberIcon />} label="Anggota" />
            )}

            {member.joined_at && member.unjoined_at && (
                <Chip
                    color="warning"
                    label="Mantan Anggota"
                    variant="outlined"
                />
            )}

            {employee.joined_at && !employee.unjoined_at && (
                <Chip
                    color="success"
                    icon={<EmployeeIcon />}
                    label={employee.position ?? 'Karyawan'}
                />
            )}

            {employee.joined_at && employee.unjoined_at && (
                <Chip
                    color="success"
                    label="Mantan Karyawan"
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
