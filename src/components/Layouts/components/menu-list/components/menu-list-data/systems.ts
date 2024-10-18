// types
import type { NavItemGroup } from '../@types/nav-item-group'
// icons
import {
    Group as GroupIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material'
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
