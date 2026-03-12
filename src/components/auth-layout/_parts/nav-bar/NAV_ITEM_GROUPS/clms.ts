// icons-materials
import Build from '@mui/icons-material/Build'
import Group from '@mui/icons-material/Group'
// modules
import Permission from '@/enums/permissions/clm'
import type NavItemGroup from '../types/nav-item-group'

const clms: NavItemGroup = {
    items: [
        {
            forPermission: Permission.READ_MASTER,
            href: process.env.NEXT_PUBLIC_V2_DOMAIN + '/clm/requisites',
            icon: Build,
            label: 'Syarat',
        },
        {
            forPermission: Permission.READ_MEMBER,
            href: process.env.NEXT_PUBLIC_V2_DOMAIN + '/clm/members',
            icon: Group,
            label: 'Anggota',
        },
    ],
    label: 'Sertifikasi dan Pengelolaan Kebun',
}

export default clms
