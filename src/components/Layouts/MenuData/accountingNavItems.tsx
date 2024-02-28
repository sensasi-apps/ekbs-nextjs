// types
import type NavItem from './NavItem.type'
// icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
// components
import GroupTitle from './GroupTitle'
// enums
import Role from '@/enums/Role'
import Cash from '@/enums/permissions/Cash'
import Finance from '@/enums/permissions/Finance'
import Wallet from '@/enums/permissions/Wallet'

const accountingNavItems: NavItem[] = [
    {
        children: <GroupTitle>Keuangan</GroupTitle>,
        forRole: [Role.MEMBER, Role.EMPLOYEE, Role.CASH_MANAGER],
    },
    {
        href: '/finances/payrolls/employees',
        label: 'Penggajian Karyawan',
        pathname: '/finances/payrolls/employees',
        icon: <PaymentsIcon />,
        forPermission: Finance.PAYROLL_EMPLOYEE,
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
        forPermission: Wallet.READ_USER_WALLET,
    },
    {
        href: '/receivables',
        label: 'Piutang',
        pathname: '/receivables',
        icon: <CreditCardIcon />,
        forPermission: Cash.READ_ALL_INSTALLMENT,
    },
]

export default accountingNavItems
