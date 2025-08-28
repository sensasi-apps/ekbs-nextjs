// types
import type NavItemGroup from '../types/nav-item-group'
// icons-materials
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
// enums
import Executive from '@/enums/permissions/Executive'

export const executives: NavItemGroup = {
    label: 'Eksekutif',
    items: [
        {
            label: 'Statistik',
            href: '/executive/statistics',
            icon: AlignHorizontalLeft,
            forPermission: [Executive.READ_EXECUTIVE_STATISTIC_DATA],
        },
        {
            label: 'Laba-Rugi',
            href: '/executive/profit-loss',
            icon: AlignHorizontalLeft,
            forPermission: [Executive.READ_EXECUTIVE_STATISTIC_DATA],
        },
    ],
}
