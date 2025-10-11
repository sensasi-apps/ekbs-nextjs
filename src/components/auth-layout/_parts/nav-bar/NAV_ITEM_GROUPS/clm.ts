// icons-materials
import Build from '@mui/icons-material/Build'
import Group from '@mui/icons-material/Group'
import Role from '@/enums/role'

import type NavItemGroup from '../types/nav-item-group'

export const clms: NavItemGroup = {
    items: [
        {
            forRole: [Role.CLM_MANAGER], // TODO: change this when feature is ready
            href: '/clm/requisites',
            icon: Build,
            label: 'Syarat',
        },
        {
            forRole: [Role.CLM_ADMIN], // TODO: change this when feature is ready
            href: '/clm/members',
            icon: Group,
            label: 'Anggota',
        },
    ],
    label: 'Sertifikasi dan Pengelolaan Kebun',
}
