// types

// icons-materials
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
// enums
import Executive from '@/enums/permissions/Executive'
import type NavItemGroup from '../types/nav-item-group'

export const executives: NavItemGroup = {
    items: [
        {
            forPermission: [Executive.READ_EXECUTIVE_STATISTIC_DATA],
            href: '/executive/statistics',
            icon: AlignHorizontalLeft,
            label: 'Statistik',
        },
        {
            forPermission: [Executive.READ_EXECUTIVE_STATISTIC_DATA],
            href: '/executive/profit-loss',
            icon: AlignHorizontalLeft,
            label: 'Laba-Rugi',
        },
    ],
    label: 'Eksekutif',
}
