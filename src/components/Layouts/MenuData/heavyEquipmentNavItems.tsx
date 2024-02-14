import type NavItem from './NavItem.type'
import EventNoteIcon from '@mui/icons-material/EventNote'
import GroupTitle from './GroupTitle'
import HeavyEquipmentRent from '@/enums/permissions/HeavyEquipmentRent'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'

const heavyEquipmentNavItems: NavItem[] = [
    {
        children: <GroupTitle>Alat Berat</GroupTitle>,
        forPermission: [
            HeavyEquipmentRent.CREATE,
            HeavyEquipmentRent.UPDATE,
            HeavyEquipmentRent.FINISH_TASK,
            HeavyEquipmentRent.READ_STATISTIC,
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
