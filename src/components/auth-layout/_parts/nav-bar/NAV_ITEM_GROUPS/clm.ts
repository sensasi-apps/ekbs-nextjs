// icons-materials
import Build from '@mui/icons-material/Build'
import Group from '@mui/icons-material/Group'
import Role from '@/enums/role'

import type NavItemGroup from '../types/nav-item-group'

export const clms: NavItemGroup = {
    label: 'Sertifikasi dan Pengelolaan Kebun',
    items: [
        {
            label: 'Syarat',
            href: '/clm/requisites',
            icon: Build,
            forRole: [Role.CLM_MANAGER], // TODO: change this when feature is ready
        },
        {
            label: 'Anggota',
            href: '/clm/members',
            icon: Group,
            forRole: [Role.CLM_ADMIN], // TODO: change this when feature is ready
        },
    ],
}
