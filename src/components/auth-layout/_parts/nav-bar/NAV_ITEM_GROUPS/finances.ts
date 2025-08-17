// types
import type NavItemGroup from '../types/nav-item-group'
// icons-materials
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import AutoStories from '@mui/icons-material/AutoStories'
import CreditCard from '@mui/icons-material/CreditCard'
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify'
import Payments from '@mui/icons-material/Payments'
import ReceiptLong from '@mui/icons-material/ReceiptLong'
import Savings from '@mui/icons-material/Savings'
// enums
// import Role from '@/enums/Role'
import Cash from '@/enums/permissions/Cash'
import Finance from '@/enums/permissions/Finance'
import Transaction from '@/enums/permissions/Transaction'
import Wallet from '@/enums/permissions/Wallet'

export const financesNavItemGroup: NavItemGroup = {
    label: 'Keuangan',
    items: [
        {
            href: '/finances/payrolls/employees',
            label: 'Penggajian Karyawan',
            icon: Payments,
            forPermission: Finance.PAYROLL_EMPLOYEE,
        },
        {
            href: '/finances/bills',
            label: 'Tagihan',
            icon: ReceiptLong,
            forPermission: Cash.READ_OWN_INSTALLMENT,
        },
        {
            href: '/finances/cashes',
            label: 'Kas',
            icon: AutoStories,
            forPermission: Transaction.READ,
        },
        {
            href: '/finances/wallets',
            label: 'Wallet Pengguna',
            icon: AccountBalanceWallet,
            forPermission: Wallet.READ_USER_WALLET,
        },
        {
            href: '/finances/debts',
            label: 'Hutang',
            icon: CreditCard,
            forPermission: Finance.READ_DEBT,
        },
        {
            href: '/finances/receivables',
            label: 'Piutang',
            pathname: ['finances/receivables', 'finances/receivables/report'],
            icon: Savings,
            forPermission: Cash.READ_ALL_INSTALLMENT,
        },
        {
            href: '/finances/tbs-payroll-list',
            label: 'Daftar Gajian TBS',
            icon: FormatAlignJustify,
            forPermission: Transaction.READ,
        },
    ],
}
