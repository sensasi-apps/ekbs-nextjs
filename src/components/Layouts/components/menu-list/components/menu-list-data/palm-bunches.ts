// types
import type NavItemGroup from '../types/nav-item-group'
// icons-materials
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
import AutoStories from '@mui/icons-material/AutoStories'
import Balance from '@mui/icons-material/Balance'
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify'
import Grass from '@mui/icons-material/Grass'
import FireTruck from '@mui/icons-material/FireTruck'
import PointOfSale from '@mui/icons-material/PointOfSale'
// enums
import PalmBunch from '@/enums/permissions/PalmBunch'
import Role from '@/enums/Role'

export const palmBunches: NavItemGroup = {
    label: 'Tandan Buah Segar',
    items: [
        {
            label: 'Statistik',
            href: '/palm-bunches/statistics',
            icon: AlignHorizontalLeft,
            forPermission: PalmBunch.READ_STATISTIC,
        },
        {
            label: 'Kas',
            href: '/palm-bunches/cashes',
            icon: AutoStories,
            forPermission: PalmBunch.READ_STATISTIC,
        },
        {
            label: 'Bobot TBS',
            href: '/palm-bunches/reports/farmer-weights',
            icon: FormatAlignJustify,
            forPermission: PalmBunch.READ_STATISTIC,
        },
        // {
        //     href: '/palm-bunches/performances',
        //     label: 'Performa Anda',
        //     icon: Assessment,
        //     forRole: [Role.FARMER, Role.COURIER],
        // },
        {
            href: '/palm-bunches/rates',
            label: 'Harga TBS',
            icon: Grass,
            forRole: Role.PALM_BUNCH_MANAGER,
        },
        {
            href: '/palm-bunches/delivery-rates',
            label: 'Tarif Angkut',
            icon: FireTruck,
            forRole: Role.PALM_BUNCH_MANAGER,
        },
        {
            href: '/palm-bunches/rea-tickets',
            pathname: [
                '/palm-bunches/rea-tickets',
                '/palm-bunches/rea-tickets/export',
                '/palm-bunches/rea-tickets/summary-per-user',
            ],
            label: 'Tiket REA',
            icon: Balance,
            forPermission: PalmBunch.READ_TICKET,
        },
        {
            href: '/palm-bunches/rea-payments',
            label: 'Pembayaran REA',
            icon: PointOfSale,
            forRole: Role.PALM_BUNCH_MANAGER,
        },
        // ################ PENDING
        // {
        //     href: '/palm-bunches/payment-monthly-report',
        //     label: 'Laporan Alur Penerimaan',
        //     icon: FormatAlignJustify,
        //     forPermission: PalmBunch.READ_STATISTIC,
        // },
    ],
}
