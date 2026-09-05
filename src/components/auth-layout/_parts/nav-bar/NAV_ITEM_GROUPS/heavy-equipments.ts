// type

import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
// icons-materials
import AutoStories from '@mui/icons-material/AutoStories'
import CreditCard from '@mui/icons-material/CreditCard'
import EventNote from '@mui/icons-material/EventNote'
// enums
import HeavyEquipmentRent from '@/enums/permissions/heavy-equipment-rent'
import type NavItemGroup from '../types/nav-item-group'

export const heavyEquipments: NavItemGroup = {
    items: [
        {
            forPermission: HeavyEquipmentRent.READ_STATISTIC,
            href: '/heavy-equipment-rents/statistics',
            icon: AlignHorizontalLeft,
            label: 'Statistik',
        },
        {
            forPermission: HeavyEquipmentRent.READ_STATISTIC,
            href: '/heavy-equipment-rents/cashes',
            icon: AutoStories,
            label: 'Kas',
        },
        {
            forPermission: HeavyEquipmentRent.READ_RECEIVABLE,
            href: '/heavy-equipment-rents/receivables',
            icon: CreditCard,
            label: 'Piutang',
        },
        {
            forPermission: HeavyEquipmentRent.READ,
            href: `${process.env.NEXT_PUBLIC_V2_DOMAIN}/heavy-equipment-rents`,
            icon: EventNote,
            label: 'Penyewaan',
        },
    ],
    label: 'Alat Berat',
}
