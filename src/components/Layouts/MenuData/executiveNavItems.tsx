// types
import type NavItem from './NavItem.type'
// components
import GroupTitle from './GroupTitle'
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import BackupTableIcon from '@mui/icons-material/BackupTable'
// enums
import Role from '@/enums/Role'

const executiveNavItems: NavItem[] = [
    {
        children: <GroupTitle>Eksekutif</GroupTitle>,
        forRole: [Role.EXECUTIVE],
    },
    {
        label: 'Statistik',
        href: '/executive/statistics',
        pathname: '/executive/statistics',
        icon: <AlignHorizontalLeftIcon />,
        forRole: Role.EXECUTIVE,
    },
    {
        label: 'Laporan',
        href: '/executive/reports',
        pathname: '/executive/reports',
        icon: <BackupTableIcon />,
        forRole: Role.EXECUTIVE,
    },
]

export default executiveNavItems
