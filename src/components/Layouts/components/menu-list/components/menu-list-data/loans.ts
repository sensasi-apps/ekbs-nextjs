// types
import type NavItemGroup from '../types/nav-item-group'
// icons-materials
import AutoStories from '@mui/icons-material/AutoStories'
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
import BackupTable from '@mui/icons-material/BackupTable'
import CurrencyExchange from '@mui/icons-material/CurrencyExchange'
import PointOfSale from '@mui/icons-material/PointOfSale'
// enums
import UserLoan from '@/enums/permissions/UserLoan'

export const loans: NavItemGroup = {
    label: 'Simpan Pinjam',
    items: [
        {
            label: 'Statistik',
            href: '/user-loans/statistics',
            icon: AlignHorizontalLeft,
            forPermission: UserLoan.READ_STATISTIC,
        },
        {
            label: 'Kas',
            href: '/user-loans/cashes',
            icon: AutoStories,
            forPermission: UserLoan.READ_STATISTIC,
        },
        {
            href: '/user-loans',
            label: 'Kelola',
            icon: BackupTable,
            forPermission: UserLoan.READ,
        },
        // {
        //     href: '/user-loans/reviews',
        //     label: 'Persetujuan',
        //     pathname: '/user-loans/reviews',
        //     icon: RateReview,
        //     forPermission: UserLoan.READ_NEED_REVIEW,
        // },
        // {
        //     href: '/user-loans/disburses',
        //     label: 'Pencairan',
        //     pathname: '/user-loans/disburses',
        //     icon: RequestQuote,
        //     forPermission: UserLoan.READ_NEED_DISBURSE,
        // },
        {
            href: '/user-loans/installments',
            label: 'Angsuran',
            icon: PointOfSale,
            forPermission: UserLoan.READ_INSTALLMENT,
        },
        {
            href: '/loans',
            label: 'Pinjaman Anda',
            icon: CurrencyExchange,
            forPermission: UserLoan.READ_OWN,
        },
    ],
}
