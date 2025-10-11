// types

import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
// icons-materials
import AutoStories from '@mui/icons-material/AutoStories'
import BackupTable from '@mui/icons-material/BackupTable'
import CurrencyExchange from '@mui/icons-material/CurrencyExchange'
import PointOfSale from '@mui/icons-material/PointOfSale'
// enums
import UserLoan from '@/enums/permissions/UserLoan'
import type NavItemGroup from '../types/nav-item-group'

export const loans: NavItemGroup = {
    items: [
        {
            forPermission: UserLoan.READ_STATISTIC,
            href: '/loans/statistics',
            icon: AlignHorizontalLeft,
            label: 'Statistik',
        },
        {
            forPermission: UserLoan.READ_STATISTIC,
            href: '/loans/cashes',
            icon: AutoStories,
            label: 'Kas',
        },
        {
            forPermission: UserLoan.READ,
            href: '/loans/manages',
            icon: BackupTable,
            label: 'Kelola',
        },
        // {
        //     href: '/user-loans/reviews',
        //     label: 'Persetujuan',
        //     icon: RateReview,
        //     forPermission: UserLoan.READ_NEED_REVIEW,
        // },
        // {
        //     href: '/user-loans/disburses',
        //     label: 'Pencairan',
        //     icon: RequestQuote,
        //     forPermission: UserLoan.READ_NEED_DISBURSE,
        // },
        {
            forPermission: UserLoan.READ_INSTALLMENT,
            href: '/loans/installments',
            icon: PointOfSale,
            label: 'Angsuran',
        },
        {
            forPermission: UserLoan.READ_OWN,
            href: '/loans',
            icon: CurrencyExchange,
            label: 'Pinjaman Anda',
        },
    ],
    label: 'Simpan Pinjam',
}
