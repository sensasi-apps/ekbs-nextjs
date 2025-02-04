// types
import type { NavItemGroup } from '../@types/nav-item-group'
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

export const accountings: NavItemGroup = {
    label: 'Keuangan',
    items: [
        {
            href: '/finances/payrolls/employees',
            label: 'Penggajian Karyawan',
            icon: Payments,
            forPermission: Finance.PAYROLL_EMPLOYEE,
        },
        /**
         * Disabled by request from JAMALUDDIN (2024-11-29)
         */
        // {
        //     href: '/wallet',
        //     label: 'Wallet',
        //     icon: AccountBalanceWallet,
        //     forRole: [Role.MEMBER, Role.EMPLOYEE],
        // },
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
            forPermission: Transaction.READ,
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
