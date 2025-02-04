// types
import type { NavItemGroup } from '../@types/nav-item-group'
// icons-materials
import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'
// enums
import Role from '@/enums/Role'

export const systems: NavItemGroup = {
    label: 'Sistem',
    items: [
        {
            href: '/users',
            label: 'Pengguna',
            pathname: '/users/[[...uuid]]',
            icon: GroupIcon,
            forRole: Role.USER_ADMIN,
        },
        {
            href: '/settings',
            label: 'Pengaturan',
            pathname: '/settings',
            icon: SettingsIcon,
            forRole: Role.SYSTEM_CONFIGURATOR,
        },
    ],
}
