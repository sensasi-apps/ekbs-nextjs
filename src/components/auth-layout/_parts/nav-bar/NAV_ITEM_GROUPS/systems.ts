// types

// icons-materials
import GroupIcon from '@mui/icons-material/Group'
// import SettingsIcon from '@mui/icons-material/Settings'
// enums
import Role from '@/enums/role'
import type NavItemGroup from '../types/nav-item-group'

export const systemsNavItemGroup: NavItemGroup = {
    items: [
        {
            forRole: Role.USER_ADMIN,
            href: '/systems/users',
            icon: GroupIcon,
            label: 'Pengguna',
        },
        // {
        //     href: '/systems/settings',
        //     label: 'Pengaturan',
        //     icon: SettingsIcon,
        //     forRole: Role.SYSTEM_CONFIGURATOR,
        // },
    ],
    label: 'Sistem',
}
