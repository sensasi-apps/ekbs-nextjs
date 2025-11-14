// types

// icons
import BadgeIcon from '@mui/icons-material/Badge'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import FireTruckIcon from '@mui/icons-material/FireTruck'
import GrassIcon from '@mui/icons-material/Grass'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
// materials
import Box from '@mui/material/Box'
import Chip, { type ChipProps } from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import type { SvgIconOwnProps } from '@mui/material/SvgIcon'

function UserRoleChips({ data, size, variant }: UserRoleChipsProps) {
    if (!data) return <Skeletons />

    const roleNames = sortData(data)

    return roleNames.map(roleName => (
        <Chip
            color={getRoleColor(roleName)}
            icon={getRoleIconByIdName(roleName)}
            key={roleName}
            label={roleName}
            size={size}
            variant={variant}
        />
    ))
}

export default UserRoleChips

function sortData(roleNames: string[]) {
    const prioritiesOrder = ['anggota', 'petani', 'pengangkut', 'karyawan']

    return [
        ...prioritiesOrder.filter(item => roleNames.includes(item)),
        ...roleNames.filter(item => !prioritiesOrder.includes(item)).sort(),
    ]
}

export function getRoleIconByIdName(
    roleName: string,
    sx: SvgIconOwnProps['sx'] = undefined,
    isUseDefault = false,
) {
    switch (roleName) {
        case 'pengguna':
            return <GroupsIcon sx={sx} />

        case 'anggota':
            return <Diversity3Icon sx={sx} />

        case 'petani':
            return <GrassIcon sx={sx} />

        case 'pengangkut':
            return <FireTruckIcon sx={sx} />

        case 'karyawan':
            return <BadgeIcon sx={sx} />

        default:
            return isUseDefault ? <PersonOutlinedIcon sx={sx} /> : undefined
    }
}

const getRoleColor = (roleName: string) => {
    switch (roleName) {
        case 'anggota':
            return 'warning'
    }
}

const Skeletons = () => (
    <Box display="flex" gap={1}>
        <Skeleton variant="rounded" width="3em" />
        <Skeleton variant="rounded" width="3em" />
        <Skeleton variant="rounded" width="3em" />
    </Box>
)

interface UserRoleChipsProps {
    /**
     * Role names in ID language
     */
    data: string[]

    size?: ChipProps['size']
    variant?: ChipProps['variant']
}
