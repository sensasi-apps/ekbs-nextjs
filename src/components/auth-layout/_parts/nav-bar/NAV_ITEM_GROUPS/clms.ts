// icons-materials
import Build from '@mui/icons-material/Build'
import Group from '@mui/icons-material/Group'
// modules
import Permission from '@/modules/clm/enums/permission'
import type NavItemGroup from '../types/nav-item-group'

const clms: NavItemGroup = {
    items: [
        {
            forPermission: Permission.READ_MASTER,
            href: '/clm/requisites',
            icon: Build,
            label: 'Syarat',
        },
        {
            forPermission: Permission.READ_MEMBER,
            href: '/clm/members',
            icon: Group,
            label: 'Anggota',
        },
    ],
    label: 'Sertifikasi dan Pengelolaan Kebun',
}

export default clms
