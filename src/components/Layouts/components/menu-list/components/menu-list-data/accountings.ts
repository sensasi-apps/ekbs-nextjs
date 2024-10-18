// types
import type { NavItemGroup } from '../@types/nav-item-group'
// icons
import {
    AccountBalanceWallet,
    AutoStories,
    CreditCard,
    FormatAlignJustify,
    Payments,
    ReceiptLong,
    Savings,
} from '@mui/icons-material'
// enums
import Role from '@/enums/Role'
import Cash from '@/enums/permissions/Cash'
import Finance from '@/enums/permissions/Finance'
import Transaction from '@/enums/permissions/Transaction'
import Wallet from '@/enums/permissions/Wallet'

export const accountings: NavItemGroup = {
    label: 'Keuangan',
    items: [
        {
            href: '/finances/payrolls/employees',
            label: 'Penggajian Karyawan',
            icon: Payments,
            forPermission: Finance.PAYROLL_EMPLOYEE,
        },
        {
            href: '/wallet',
            label: 'Wallet',
            icon: AccountBalanceWallet,
            forRole: [Role.MEMBER, Role.EMPLOYEE],
        },
        {
            href: '/bills',
            label: 'Tagihan',
            icon: ReceiptLong,
            forPermission: Cash.READ_OWN_INSTALLMENT,
        },
        {
            href: '/cashes',
            label: 'Kas',
            icon: AutoStories,
            forPermission: [Cash.READ, Transaction.READ],
        },
        {
            href: '/wallets',
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
            href: '/receivables',
            label: 'Piutang',
            pathname: ['/receivables', '/receivables/report'],
            icon: Savings,
            forPermission: Cash.READ_ALL_INSTALLMENT,
        },
        {
            href: '/tbs-payroll-list',
            label: 'Daftar Gajian TBS',
            icon: FormatAlignJustify,
            forPermission: Transaction.READ,
        },
    ],
}
