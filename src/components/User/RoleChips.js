import PropTypes from 'prop-types'
import { memo } from 'react'
import { Box, Chip, Skeleton } from '@mui/material'

import BadgeIcon from '@mui/icons-material/Badge'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import FireTruckIcon from '@mui/icons-material/FireTruck'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import GrassIcon from '@mui/icons-material/Grass'

const getRoleIconByIdName = (roleName, sx, isUseDefault = false) => {
    switch (roleName) {
        case 'pengguna':
            return <GroupsIcon sx={sx} />

        case 'petani':
            return <GrassIcon sx={sx} />

        case 'anggota':
            return <Diversity3Icon sx={sx} />

        case 'karyawan':
            return <BadgeIcon sx={sx} />

        case 'pengangkut':
            return <FireTruckIcon sx={sx} />

        default:
            return isUseDefault ? <PersonOutlinedIcon sx={sx} /> : undefined
    }
}

const getRoleColor = roleName => {
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

const UserRoleChips = ({ data: roleNames, size, variant }) => {
    if (!roleNames) return <Skeletons />

    return (
        <Box display="flex" gap={1} textTransform="capitalize">
            {roleNames.map(roleName => (
                <Chip
                    variant={variant}
                    key={roleName}
                    size={size}
                    label={roleName}
                    icon={getRoleIconByIdName(roleName)}
                    color={getRoleColor(roleName)}
                />
            ))}
        </Box>
    )
}

UserRoleChips.propTypes = {
    data: PropTypes.array,
    size: PropTypes.oneOf(['small', 'medium']),
    variant: PropTypes.oneOf(['filled', 'outlined']),
}

export { getRoleIconByIdName }
export default memo(UserRoleChips)
