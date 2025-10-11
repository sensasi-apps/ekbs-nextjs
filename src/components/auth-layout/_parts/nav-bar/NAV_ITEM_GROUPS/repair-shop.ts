// icons
import AllInbox from '@mui/icons-material/AllInbox'
import CashIcon from '@mui/icons-material/AutoStories'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import SavingsIcon from '@mui/icons-material/Savings'
import CartIcon from '@mui/icons-material/ShoppingCart'
import TopicIcon from '@mui/icons-material/Topic'
// enums
import Permission from '@/modules/repair-shop/enums/permission'
import type NavItemGroup from '../types/nav-item-group'

export const repairShop: NavItemGroup = {
    items: [
        // {
        //     label: 'Statistik',
        //     href: '/palm-bunches/statistics',
        //     icon: AlignHorizontalLeft,
        //     forPermission: PalmBunch.READ_STATISTIC,
        // },
        {
            forPermission: Permission.READ_SPARE_PART,
            href: '/repair-shop/spare-parts',
            icon: TopicIcon,
            label: 'Suku Cadang',
        },

        {
            forPermission: Permission.READ_SERVICE,
            href: '/repair-shop/services',
            icon: TopicIcon,
            label: 'Layanan',
        },

        {
            forPermission: Permission.READ_RECEIVABLE,
            href: '/repair-shop/receivables',
            icon: SavingsIcon,
            label: 'Piutang',
        },

        {
            forPermission: Permission.READ_PURCHASE,
            href: '/repair-shop/spare-part-purchases',
            icon: CartIcon,
            label: 'Pembelian Stok',
        },

        {
            forPermission: Permission.READ_SALE,
            href: '/repair-shop/sales',
            icon: PointOfSaleIcon,
            label: 'Penjualan',
        },

        {
            forPermission: Permission.READ_CASH,
            href: '/repair-shop/cashes',
            icon: CashIcon,
            label: 'Kas',
        },

        {
            forPermission: Permission.READ_SPARE_PART_QTY_ADJUSTMENT,
            href: '/repair-shop/spare-part-qty-adjustments',
            icon: AllInbox,
            label: 'Opname',
        },
    ],
    label: 'Belayan Spare Parts',
}
