import { Divider, Typography } from '@mui/material'

import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import BalanceIcon from '@mui/icons-material/Balance'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import ForestIcon from '@mui/icons-material/Forest'
import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'

const SubTitle = ({ children }) => (
    <Typography ml={2} mt={2} variant="overline" color="grey" fontWeight="bold">
        {children}
    </Typography>
)

export default [
    {
        href: '/dashboard',
        label: 'Dasbor',
        pathname: '/dashboard',
        icon: <DashboardIcon />,
        forRoles: [],
        forPermissions: [],
    },
    {
        component: <SubTitle>Unit</SubTitle>,
        forRoles: [],
        forPermissions: [],
    },
    {
        href: '/TBS',
        label: 'TBS',
        pathname: '/TBS',
        icon: <BalanceIcon />,
        forRoles: [],
        forPermissions: [],
    },
    {
        href: '/saprodi',
        label: 'SAPRODI',
        pathname: '/saprodi',
        icon: <ForestIcon />,
        forRoles: [],
        forPermissions: [],
    },
    {
        href: '/alat-berat',
        label: 'Alat Berat',
        pathname: '/alat-berat',
        icon: <AgricultureIcon />,
        forRoles: [],
        forPermissions: [],
    },
    {
        component: <Divider sx={{ mt: 2 }} />,
        forRoles: [],
        forPermissions: [],
    },
    {
        component: <SubTitle>Simpan Pinjam</SubTitle>,
        forRoles: [],
        forPermissions: [],
    },
    {
        href: '/loans',
        label: 'Pinjaman Anda',
        pathname: '/loans',
        icon: <CurrencyExchangeIcon />,
        forRoles: ['member', 'courier', 'employee'],
        forPermissions: [],
    },
    {
        href: '/user-loans',
        label: 'Kelola Pinjaman',
        pathname: '/user-loans',
        icon: <CurrencyExchangeIcon />,
        forRoles: [
            'user loans manager',
            'user loans reviewer',
            'user loans collector',
        ],
        forPermissions: [],
    },
    {
        component: <Divider sx={{ mt: 2 }} />,
        forRoles: [],
        forPermissions: [],
    },
    {
        component: <SubTitle>Keuangan</SubTitle>,
        forRoles: [],
        forPermissions: [],
    },
    {
        href: '/cashes',
        label: 'Kas',
        pathname: '/cashes',
        icon: <AutoStoriesIcon />,
        forRoles: ['cashes manager'],
        forPermissions: [
            'cashes create',
            'cashes update',
            'cashes read',
            'cashes search',
        ],
    },
    {
        component: <Divider sx={{ mt: 2 }} />,
        forRoles: ['users admin'],
        forPermissions: [
            'users create',
            'users update',
            'users read',
            'users search',
        ],
    },
    {
        component: <SubTitle>Sistem</SubTitle>,
        forRoles: ['users admin'],
        forPermissions: [
            'users create',
            'users update',
            'users read',
            'users search',
        ],
    },
    {
        href: '/users',
        label: 'Pengguna',
        pathname: '/users/[[...uuid]]',
        icon: <GroupIcon />,
        forRoles: ['users admin'],
        forPermissions: [
            'users create',
            'users update',
            'users read',
            'users search',
        ],
    },
    {
        href: '/settings',
        label: 'Pengaturan',
        pathname: '/settings',
        icon: <SettingsIcon />,
        forRoles: ['systems admin'],
        forPermissions: ['settings update'],
    },
]
