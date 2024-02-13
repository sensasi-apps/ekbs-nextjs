import type NavItem from './NavItem.type'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import RateReviewIcon from '@mui/icons-material/RateReview'
import Role from '@/enums/Role'
import GroupTitle from './GroupTitle'

const loanNavItems: NavItem[] = [
    {
        children: <GroupTitle>Simpan Pinjam</GroupTitle>,
        forRole: [Role.MEMBER, Role.EMPLOYEE],
    },
    {
        href: '/loans',
        label: 'Pinjaman Anda',
        pathname: '/loans',
        icon: <CurrencyExchangeIcon />,
        forRole: [Role.MEMBER, Role.EMPLOYEE],
    },
    {
        href: '/user-loans',
        label: 'Kelola',
        pathname: '/user-loans',
        icon: <BackupTableIcon />,
        forRole: Role.USER_LOAN_MANAGER,
    },
    {
        href: '/user-loans/reviews',
        label: 'Persetujuan',
        pathname: '/user-loans/reviews',
        icon: <RateReviewIcon />,
        forRole: Role.USER_LOAN_REVIEWER,
    },
    {
        href: '/user-loans/disburses',
        label: 'Pencairan',
        pathname: '/user-loans/disburses',
        icon: <RequestQuoteIcon />,
        forRole: Role.USER_LOAN_DISBURSER,
    },
    {
        href: '/user-loans/installments',
        label: 'Angsuran',
        pathname: '/user-loans/installments',
        icon: <PointOfSaleIcon />,
        forRole: Role.USER_LOAN_INSTALLMENT_COLLECTOR,
    },
]

export default loanNavItems
