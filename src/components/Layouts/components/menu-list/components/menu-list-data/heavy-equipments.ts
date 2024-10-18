// type
import type { NavItemGroup } from '../@types/nav-item-group'
// icons
import {
    AutoStories,
    AlignHorizontalLeft,
    CreditCard,
    EventNote,
} from '@mui/icons-material'
// enums
import HeavyEquipmentRent from '@/enums/permissions/HeavyEquipmentRent'

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
            href: '/heavy-equipment-rents',
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
