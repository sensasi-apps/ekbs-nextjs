// types
import type NavItem from './NavItem.type'
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
// import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
// import RateReviewIcon from '@mui/icons-material/RateReview'
// page components
import GroupTitle from './GroupTitle'
// enums
import UserLoan from '@/enums/permissions/UserLoan'

const loanNavItems: NavItem[] = [
    {
        children: <GroupTitle>Simpan Pinjam</GroupTitle>,
        forPermission: [
            UserLoan.READ,
            UserLoan.READ_NEED_REVIEW,
            UserLoan.READ_NEED_DISBURSE,
            UserLoan.READ_INSTALLMENT,
            UserLoan.READ_OWN,
            UserLoan.READ_STATISTIC,
        ],
    },
    {
        label: 'Statistik',
        href: '/user-loans/statistics',
        pathname: '/user-loans/statistics',
        icon: <AlignHorizontalLeftIcon />,
        forPermission: UserLoan.READ_STATISTIC,
    },
    {
        href: '/user-loans',
        label: 'Kelola',
        pathname: '/user-loans',
        icon: <BackupTableIcon />,
        forPermission: UserLoan.READ,
    },
    // {
    //     href: '/user-loans/reviews',
    //     label: 'Persetujuan',
    //     pathname: '/user-loans/reviews',
    //     icon: <RateReviewIcon />,
    //     forPermission: UserLoan.READ_NEED_REVIEW,
    // },
    // {
    //     href: '/user-loans/disburses',
    //     label: 'Pencairan',
    //     pathname: '/user-loans/disburses',
    //     icon: <RequestQuoteIcon />,
    //     forPermission: UserLoan.READ_NEED_DISBURSE,
    // },
    {
        href: '/user-loans/installments',
        label: 'Angsuran',
        pathname: '/user-loans/installments',
        icon: <PointOfSaleIcon />,
        forPermission: UserLoan.READ_INSTALLMENT,
    },
    {
        href: '/loans',
        label: 'Pinjaman Anda',
        pathname: '/loans',
        icon: <CurrencyExchangeIcon />,
        forPermission: UserLoan.READ_OWN,
    },
]

export default loanNavItems
