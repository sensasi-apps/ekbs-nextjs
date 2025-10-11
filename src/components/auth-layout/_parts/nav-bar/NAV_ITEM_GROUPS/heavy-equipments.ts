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
            forPermission: [
                HeavyEquipmentRent.CREATE,
                HeavyEquipmentRent.UPDATE,
            ],
            href: '/heavy-equipment-rents/rents',
            icon: EventNote,
            label: 'Penyewaan',
        },
        {
            forPermission: HeavyEquipmentRent.FINISH_TASK,
            href: '/heavy-equipment-rents/tasks',
            icon: EventNote,
            label: 'Tugas',
        },
    ],
    label: 'Alat Berat',
}
