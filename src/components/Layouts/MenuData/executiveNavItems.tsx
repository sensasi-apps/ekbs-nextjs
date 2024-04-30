// types
import type NavItem from './NavItem.type'
// components
import GroupTitle from './GroupTitle'
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
// import BackupTableIcon from '@mui/icons-material/BackupTable'
// enums
import Executive from '@/enums/permissions/Executive'

const executiveNavItems: NavItem[] = [
    {
        children: <GroupTitle>Eksekutif</GroupTitle>,
        forPermission: [Executive.READ_EXECUTIVE_STATISTIC_DATA],
    },
    {
        label: 'Statistik',
        href: '/executive/statistics',
        pathname: '/executive/statistics',
        icon: <AlignHorizontalLeftIcon />,
        forPermission: [Executive.READ_EXECUTIVE_STATISTIC_DATA],
    },
    {
        label: 'Laba-Rugi',
        href: '/executive/profit-loss',
        pathname: '/executive/profit-loss',
        icon: <AlignHorizontalLeftIcon />,
        forPermission: [Executive.READ_EXECUTIVE_STATISTIC_DATA],
    },
    // {
    //     label: 'Laporan',
    //     href: '/executive/reports',
    //     pathname: '/executive/reports',
    //     icon: <BackupTableIcon />,
    //     forRole: Role.EXECUTIVE,
    // },
]

export default executiveNavItems
