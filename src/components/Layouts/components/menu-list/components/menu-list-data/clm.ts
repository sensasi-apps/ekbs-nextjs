// icons-materials
import Group from '@mui/icons-material/Group'

import type NavItemGroup from '../types/nav-item-group'

export const clms: NavItemGroup = {
    label: 'Sertifikasi dan Pengelolaan Kebun',
    items: [
        {
            label: 'Anggota',
            href: '/clm/members',
            icon: Group,
            forRole: [], // TODO: change this when feature is ready
        },
    ],
}
