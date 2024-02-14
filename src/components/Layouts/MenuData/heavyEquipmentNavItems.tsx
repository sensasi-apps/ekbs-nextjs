// type
import type NavItem from './NavItem.type'
// page components
import GroupTitle from './GroupTitle'
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EventNoteIcon from '@mui/icons-material/EventNote'
// enums
import HeavyEquipmentRent from '@/enums/permissions/HeavyEquipmentRent'

const heavyEquipmentNavItems: NavItem[] = [
    {
        children: <GroupTitle>Alat Berat</GroupTitle>,
        forPermission: [
            HeavyEquipmentRent.CREATE,
            HeavyEquipmentRent.UPDATE,
            HeavyEquipmentRent.FINISH_TASK,
            HeavyEquipmentRent.READ_STATISTIC,
            HeavyEquipmentRent.READ_RECEIVABLE,
        ],
    },
    {
        label: 'Statistik',
        href: '/heavy-equipment-rents/statistics',
        pathname: '/heavy-equipment-rents/statistics',
        icon: <AlignHorizontalLeftIcon />,
        forPermission: [HeavyEquipmentRent.READ_STATISTIC],
    },
    {
        label: 'Piutang',
        href: '/heavy-equipment-rents/receivables',
        pathname: '/heavy-equipment-rents/receivables',
        icon: <CreditCardIcon />,
        forPermission: [HeavyEquipmentRent.READ_RECEIVABLE],
    },
    {
        href: '/heavy-equipment-rents',
        label: 'Penyewaan',
        pathname: '/heavy-equipment-rents',
        icon: <EventNoteIcon />,
        forPermission: [HeavyEquipmentRent.CREATE, HeavyEquipmentRent.UPDATE],
    },
    {
        href: '/heavy-equipment-rents/tasks',
        label: 'Tugas',
        pathname: '/heavy-equipment-rents/tasks',
        icon: <EventNoteIcon />,
        forPermission: [HeavyEquipmentRent.FINISH_TASK],
    },
]

export default heavyEquipmentNavItems
