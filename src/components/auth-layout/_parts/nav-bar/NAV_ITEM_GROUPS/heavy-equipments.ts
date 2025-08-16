// type
import type NavItemGroup from '../types/nav-item-group'
// icons-materials
import AutoStories from '@mui/icons-material/AutoStories'
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
import CreditCard from '@mui/icons-material/CreditCard'
import EventNote from '@mui/icons-material/EventNote'
// enums
import HeavyEquipmentRent from '@/enums/permissions/heavy-equipment-rent'

export const heavyEquipments: NavItemGroup = {
    label: 'Alat Berat',
    items: [
        {
            label: 'Statistik',
            href: '/heavy-equipment-rents/statistics',
            icon: AlignHorizontalLeft,
            forPermission: HeavyEquipmentRent.READ_STATISTIC,
        },
        {
            label: 'Kas',
            href: '/heavy-equipment-rents/cashes',
            icon: AutoStories,
            forPermission: HeavyEquipmentRent.READ_STATISTIC,
        },
        {
            label: 'Piutang',
            href: '/heavy-equipment-rents/receivables',
            icon: CreditCard,
            forPermission: HeavyEquipmentRent.READ_RECEIVABLE,
        },
        {
            href: '/heavy-equipment-rents/rents',
            label: 'Penyewaan',
            icon: EventNote,
            forPermission: [
                HeavyEquipmentRent.CREATE,
                HeavyEquipmentRent.UPDATE,
            ],
        },
        {
            href: '/heavy-equipment-rents/tasks',
            label: 'Tugas',
            icon: EventNote,
            forPermission: HeavyEquipmentRent.FINISH_TASK,
        },
    ],
}
