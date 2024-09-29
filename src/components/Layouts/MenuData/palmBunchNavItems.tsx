// types
import type NavItem from './NavItem.type'
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import AssessmentIcon from '@mui/icons-material/Assessment'
import BalanceIcon from '@mui/icons-material/Balance'
import FireTruckIcon from '@mui/icons-material/FireTruck'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import GrassIcon from '@mui/icons-material/Grass'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
// enums
import PalmBunch from '@/enums/permissions/PalmBunch'
import Role from '@/enums/Role'
import GroupTitle from './GroupTitle'

const palmBunchNavItems: NavItem[] = [
    {
        children: <GroupTitle>Tandan Buah Segar</GroupTitle>,
        forRole: [
            Role.PALM_BUNCH_ADMIN,
            Role.PALM_BUNCH_MANAGER,
            Role.FARMER,
            Role.COURIER,
        ],
    },
    {
        label: 'Statistik',
        href: '/palm-bunches/statistics',
        icon: <AlignHorizontalLeftIcon />,
        forPermission: PalmBunch.READ_STATISTIC,
    },
    {
        label: 'Kas',
        href: '/palm-bunches/cashes',
        icon: <AutoStoriesIcon />,
        forPermission: PalmBunch.READ_STATISTIC,
    },
    {
        label: 'Bobot TBS',
        href: '/palm-bunches/reports/farmer-weights',
        icon: <FormatAlignJustifyIcon />,
        forPermission: PalmBunch.READ_STATISTIC,
    },
    {
        href: '/palm-bunches/performances',
        label: 'Performa Anda',
        icon: <AssessmentIcon />,
        forRole: [Role.FARMER, Role.COURIER],
    },
    {
        href: '/palm-bunches/rates',
        label: 'Harga TBS',
        icon: <GrassIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
    {
        href: '/palm-bunches/delivery-rates',
        label: 'Tarif Angkut',
        icon: <FireTruckIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
    {
        href: '/palm-bunches/rea-tickets',
        pathname: [
            '/palm-bunches/rea-tickets',
            '/palm-bunches/rea-tickets/export',
        ],
        label: 'Tiket REA',
        icon: <BalanceIcon />,
        forPermission: PalmBunch.READ_TICKET,
    },
    {
        href: '/palm-bunches/rea-payments',
        label: 'Pembayaran REA',
        icon: <PointOfSaleIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
    // ################ PENDING
    // {
    //     href: '/palm-bunches/payment-monthly-report',
    //     label: 'Laporan Alur Penerimaan',
    //     icon: <FormatAlignJustify />,
    //     forPermission: PalmBunch.READ_STATISTIC,
    // },
]

export default palmBunchNavItems
