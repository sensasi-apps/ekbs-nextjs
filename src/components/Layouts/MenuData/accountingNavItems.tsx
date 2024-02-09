import type NavItem from './NavItem.type'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import Role from '@/enums/Role'
import GroupTitle from './GroupTitle'
import Cash from '@/enums/permissions/Cash'

const accountingNavItems: NavItem[] = [
    {
        children: <GroupTitle>Keuangan</GroupTitle>,
        forRole: [Role.MEMBER, Role.EMPLOYEE, Role.CASH_MANAGER],
    },
    {
        href: '/wallet',
        label: 'Wallet',
        pathname: '/wallet',
        icon: <AccountBalanceWalletIcon />,
        forRole: [Role.MEMBER, Role.EMPLOYEE],
    },
    {
        href: '/bills',
        label: 'Tagihan',
        pathname: '/bills',
        icon: <ReceiptLongIcon />,
        forPermission: Cash.READ_OWN_INSTALLMENT,
    },
    {
        href: '/cashes',
        label: 'Kas',
        pathname: '/cashes',
        icon: <AutoStoriesIcon />,
        forRole: Role.CASH_MANAGER,
    },
    {
        href: '/wallets',
        label: 'Wallet Pengguna',
        pathname: '/wallets',
        icon: <AccountBalanceWalletIcon />,
        forRole: Role.CASH_MANAGER,
    },
    {
        href: '/receivables',
        label: 'Piutang',
        pathname: '/receivables',
        icon: <CreditScoreIcon />,
        forPermission: Cash.READ_ALL_INSTALLMENT,
    },
]

export default accountingNavItems
