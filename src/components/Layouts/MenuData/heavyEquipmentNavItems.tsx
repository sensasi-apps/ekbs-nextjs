import type NavItem from './NavItem.type'
import EventNoteIcon from '@mui/icons-material/EventNote'
import GroupTitle from './GroupTitle'
import HeavyEquipmentRent from '@/enums/permissions/HeavyEquipmentRent'

const heavyEquipmentNavItems: NavItem[] = [
    {
        children: <GroupTitle>Alat Berat</GroupTitle>,
        forPermission: [
            HeavyEquipmentRent.CREATE,
            HeavyEquipmentRent.UPDATE,
            HeavyEquipmentRent.FINISH_TASK,
        ],
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
