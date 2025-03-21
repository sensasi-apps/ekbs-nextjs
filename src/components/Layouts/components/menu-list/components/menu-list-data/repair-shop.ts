import type NavItemGroup from '../types/nav-item-group'
// icons
import TopicIcon from '@mui/icons-material/Topic'
// enums
import SparePartPermission from '@/features/repair-shop--spare-part/enums/permission'
import ServicePermission from '@/features/repair-shop--service/enums/permission'

export const repairShop: NavItemGroup = {
    label: 'Belayan Spare Parts',
    items: [
        // {
        //     label: 'Statistik',
        //     href: '/palm-bunches/statistics',
        //     icon: AlignHorizontalLeft,
        //     forPermission: PalmBunch.READ_STATISTIC,
        // },
        // {
        //     label: 'Kas',
        //     href: '/palm-bunches/cashes',
        //     icon: AutoStories,
        //     forPermission: PalmBunch.READ_STATISTIC,
        // },
        {
            label: 'Suku Cadang',
            href: '/repair-shop/spare-parts',
            icon: TopicIcon,
            forPermission: SparePartPermission.READ,
        },

        {
            label: 'Layanan',
            href: '/repair-shop/services',
            icon: TopicIcon,
            forPermission: ServicePermission.READ,
        },

        // {
        //     label: 'Bobot TBS',
        //     href: '/palm-bunches/reports/farmer-weights',
        //     icon: FormatAlignJustify,
        //     forPermission: PalmBunch.READ_STATISTIC,
        // },
        // {
        //     href: '/palm-bunches/rates',
        //     label: 'Harga TBS',
        //     icon: Grass,
        //     forRole: Role.PALM_BUNCH_MANAGER,
        // },
        // {
        //     href: '/palm-bunches/delivery-rates',
        //     label: 'Tarif Angkut',
        //     icon: FireTruck,
        //     forRole: Role.PALM_BUNCH_MANAGER,
        // },
        // {
        //     href: '/palm-bunches/rea-tickets',
        //     pathname: [
        //         '/palm-bunches/rea-tickets',
        //         '/palm-bunches/rea-tickets/export',
        //         '/palm-bunches/rea-tickets/summary-per-user',
        //     ],
        //     label: 'Tiket REA',
        //     icon: Balance,
        //     forPermission: PalmBunch.READ_TICKET,
        // },
        // {
        //     href: '/palm-bunches/rea-payments',
        //     label: 'Pembayaran REA',
        //     icon: PointOfSale,
        //     forRole: Role.PALM_BUNCH_MANAGER,
        // },
    ],
}
