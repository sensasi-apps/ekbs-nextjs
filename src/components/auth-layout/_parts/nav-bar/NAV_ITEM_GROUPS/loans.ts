// icons-materials
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import Payments from '@mui/icons-material/Payments'
import RequestQuote from '@mui/icons-material/RequestQuote'
// enums
import UserLoan from '@/enums/permissions/UserLoan'
import type NavItemGroup from '../types/nav-item-group'

export const loans: NavItemGroup = {
    items: [
        {
            forPermission: UserLoan.READ_STATISTIC,
            href: '/loans/cashes',
            icon: AccountBalanceWallet,
            label: 'Kas',
        },
        {
            forPermission: UserLoan.READ,
            href: `${process.env.NEXT_PUBLIC_V2_DOMAIN}/saving-and-loan/loans`,
            icon: RequestQuote,
            label: 'Kelola Pinjaman',
        },
        {
            forPermission: UserLoan.READ_INSTALLMENT,
            href: '/loans/installments',
            icon: Payments,
            label: 'Pembayaran Angsuran',
        },
    ],
    label: 'Simpan Pinjam',
}
