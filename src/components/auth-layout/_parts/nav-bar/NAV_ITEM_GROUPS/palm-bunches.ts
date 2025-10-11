// types

// icons-materials
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
import AutoStories from '@mui/icons-material/AutoStories'
import Balance from '@mui/icons-material/Balance'
import FireTruck from '@mui/icons-material/FireTruck'
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify'
import Grass from '@mui/icons-material/Grass'
import PointOfSale from '@mui/icons-material/PointOfSale'
// enums
import PalmBunch from '@/enums/permissions/PalmBunch'
import Role from '@/enums/role'
import type NavItemGroup from '../types/nav-item-group'

export const palmBunches: NavItemGroup = {
    items: [
        {
            forPermission: PalmBunch.READ_STATISTIC,
            href: '/palm-bunches/statistics',
            icon: AlignHorizontalLeft,
            label: 'Statistik',
        },
        {
            forPermission: PalmBunch.READ_STATISTIC,
            href: '/palm-bunches/cashes',
            icon: AutoStories,
            label: 'Kas',
        },
        {
            forPermission: PalmBunch.READ_STATISTIC,
            href: '/palm-bunches/reports/farmer-weights',
            icon: FormatAlignJustify,
            label: 'Bobot TBS',
        },
        // {
        //     href: '/palm-bunches/performances',
        //     label: 'Performa Anda',
        //     icon: Assessment,
        //     forRole: [Role.FARMER, Role.COURIER],
        // },
        {
            forRole: Role.PALM_BUNCH_MANAGER,
            href: '/palm-bunches/rates',
            icon: Grass,
            label: 'Harga TBS',
        },
        {
            forRole: Role.PALM_BUNCH_MANAGER,
            href: '/palm-bunches/delivery-rates',
            icon: FireTruck,
            label: 'Tarif Angkut',
        },
        {
            forPermission: PalmBunch.READ_TICKET,
            href: '/palm-bunches/rea-tickets',
            icon: Balance,
            label: 'Tiket REA',
        },
        {
            forRole: Role.PALM_BUNCH_MANAGER,
            href: '/palm-bunches/rea-payments',
            icon: PointOfSale,
            label: 'Pembayaran REA',
        },
        // ################ PENDING
        // {
        //     href: '/palm-bunches/payment-monthly-report',
        //     label: 'Laporan Alur Penerimaan',
        //     icon: FormatAlignJustify,
        //     forPermission: PalmBunch.READ_STATISTIC,
        // },
    ],
    label: 'Tandan Buah Segar',
}
