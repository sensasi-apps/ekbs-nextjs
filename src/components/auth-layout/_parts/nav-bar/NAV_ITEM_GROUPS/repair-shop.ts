import type NavItemGroup from '../types/nav-item-group'
// icons
import AllInbox from '@mui/icons-material/AllInbox'
import TopicIcon from '@mui/icons-material/Topic'
import CashIcon from '@mui/icons-material/AutoStories'
import CartIcon from '@mui/icons-material/ShoppingCart'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import SavingsIcon from '@mui/icons-material/Savings'
// enums
import Permission from '@/modules/repair-shop/enums/permission'

export const repairShop: NavItemGroup = {
    label: 'Belayan Spare Parts',
    items: [
        // {
        //     label: 'Statistik',
        //     href: '/palm-bunches/statistics',
        //     icon: AlignHorizontalLeft,
        //     forPermission: PalmBunch.READ_STATISTIC,
        // },
        {
            label: 'Suku Cadang',
            href: '/repair-shop/spare-parts',
            icon: TopicIcon,
            forPermission: Permission.READ_SPARE_PART,
        },

        {
            label: 'Layanan',
            href: '/repair-shop/services',
            icon: TopicIcon,
            forPermission: Permission.READ_SERVICE,
        },

        {
            label: 'Piutang',
            href: '/repair-shop/receivables',
            icon: SavingsIcon,
            forPermission: Permission.READ_RECEIVABLE,
        },

        {
            label: 'Pembelian Stok',
            href: '/repair-shop/spare-part-purchases',
            icon: CartIcon,
            forPermission: Permission.READ_PURCHASE,
        },

        {
            label: 'Penjualan',
            href: '/repair-shop/sales',
            icon: PointOfSaleIcon,
            forPermission: Permission.READ_SALE,
        },

        {
            label: 'Kas',
            href: '/repair-shop/cashes',
            icon: CashIcon,
            forPermission: Permission.READ_CASH,
        },

        {
            label: 'Opname',
            href: '/repair-shop/spare-part-qty-adjustments',
            icon: AllInbox,
            forPermission: Permission.READ_SPARE_PART_QTY_ADJUSTMENT,
        },
    ],
}
