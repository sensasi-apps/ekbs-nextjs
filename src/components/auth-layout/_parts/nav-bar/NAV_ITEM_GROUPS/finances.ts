// types

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
import type NavItemGroup from '../types/nav-item-group'

export const financesNavItemGroup: NavItemGroup = {
    items: [
        {
            forPermission: Finance.PAYROLL_EMPLOYEE,
            href: '/finances/payrolls/employees',
            icon: Payments,
            label: 'Penggajian Karyawan',
        },
        {
            forPermission: Cash.READ_OWN_INSTALLMENT,
            href: '/finances/bills',
            icon: ReceiptLong,
            label: 'Tagihan',
        },
        {
            forPermission: Transaction.READ,
            href: '/finances/cashes',
            icon: AutoStories,
            label: 'Kas',
        },
        {
            forPermission: Wallet.READ_USER_WALLET,
            href: '/finances/wallets',
            icon: AccountBalanceWallet,
            label: 'Wallet Pengguna',
        },
        {
            forPermission: Finance.READ_DEBT,
            href: '/finances/debts',
            icon: CreditCard,
            label: 'Hutang',
        },
        {
            forPermission: Cash.READ_ALL_INSTALLMENT,
            href: '/finances/receivables',
            icon: Savings,
            label: 'Piutang',
        },
        {
            forPermission: Transaction.READ,
            href: '/finances/tbs-payroll-list',
            icon: FormatAlignJustify,
            label: 'Daftar Gajian TBS',
        },
    ],
    label: 'Keuangan',
}
