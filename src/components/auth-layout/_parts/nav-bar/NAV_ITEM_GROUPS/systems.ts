// types

// icons-materials
import GroupIcon from '@mui/icons-material/Group'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
// import SettingsIcon from '@mui/icons-material/Settings'
// enums
import PalmBunch from '@/enums/permissions/PalmBunch'
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
        {
            forPermission: PalmBunch.SEARCH_USER,
            href: `${process.env.NEXT_PUBLIC_V2_DOMAIN}/systems/user-search`,
            icon: ManageSearchIcon,
            label: 'Cari Pengguna',
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
