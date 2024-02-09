import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'
import NavItem from './NavItem.type'
import GroupTitle from './GroupTitle'
import Role from '@/enums/Role'

const systemNavItems: NavItem[] = [
    {
        children: <GroupTitle>Sistem</GroupTitle>,
        forRole: [Role.USER_ADMIN, Role.SYSTEM_CONFIGURATOR],
    },
    {
        href: '/users',
        label: 'Pengguna',
        pathname: '/users/[[...uuid]]',
        icon: <GroupIcon />,
        forRole: Role.USER_ADMIN,
    },
    {
        href: '/settings',
        label: 'Pengaturan',
        pathname: '/settings',
        icon: <SettingsIcon />,
        forRole: Role.SYSTEM_CONFIGURATOR,
    },
]

export default systemNavItems
