// types
import type NavItem from './NavItem.type'
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import AssessmentIcon from '@mui/icons-material/Assessment'
import BalanceIcon from '@mui/icons-material/Balance'
import FireTruckIcon from '@mui/icons-material/FireTruck'
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
        pathname: '/palm-bunches/statistics',
        icon: <AlignHorizontalLeftIcon />,
        forPermission: PalmBunch.READ_STATISTIC,
    },
    {
        href: '/palm-bunches/performances',
        label: 'Performa Anda',
        pathname: '/palm-bunches/performances',
        icon: <AssessmentIcon />,
        forRole: [Role.FARMER, Role.COURIER],
    },
    {
        href: '/palm-bunches/rates',
        label: 'Harga TBS',
        pathname: '/palm-bunches/rates',
        icon: <GrassIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
    {
        href: '/palm-bunches/delivery-rates',
        label: 'Tarif Angkut',
        pathname: '/palm-bunches/delivery-rates',
        icon: <FireTruckIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
    {
        href: '/palm-bunches/rea-tickets',
        label: 'Tiket REA',
        pathname: '/palm-bunches/rea-tickets',
        icon: <BalanceIcon />,
        forPermission: PalmBunch.READ_TICKET,
    },
    {
        href: '/palm-bunches/rea-payments',
        label: 'Pembayaran REA',
        pathname: '/palm-bunches/rea-payments',
        icon: <PointOfSaleIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
]

export default palmBunchNavItems
