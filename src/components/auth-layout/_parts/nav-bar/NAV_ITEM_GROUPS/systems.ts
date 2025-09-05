// types
import type NavItemGroup from '../types/nav-item-group'
// icons-materials
import GroupIcon from '@mui/icons-material/Group'
// import SettingsIcon from '@mui/icons-material/Settings'
// enums
import Role from '@/enums/role'

export const systemsNavItemGroup: NavItemGroup = {
    label: 'Sistem',
    items: [
        {
            href: '/systems/users',
            label: 'Pengguna',
            icon: GroupIcon,
            forRole: Role.USER_ADMIN,
        },
        // {
        //     href: '/systems/settings',
        //     label: 'Pengaturan',
        //     icon: SettingsIcon,
        //     forRole: Role.SYSTEM_CONFIGURATOR,
        // },
    ],
}
