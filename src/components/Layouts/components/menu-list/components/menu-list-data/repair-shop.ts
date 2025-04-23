import type NavItemGroup from '../types/nav-item-group'
// icons
import TopicIcon from '@mui/icons-material/Topic'
import CartIcon from '@mui/icons-material/ShoppingCart'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
// enums
import PurchasePermission from '@/features/repair-shop--purchase/enums/permission'
import SparePartPermission from '@/features/repair-shop--spare-part/enums/permission'
import ServicePermission from '@/features/repair-shop--service/enums/permission'
import SalePermission from '@/features/repair-shop--sale/enums/permission'

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

        {
            label: 'Pembelian Stok',
            href: '/repair-shop/spare-part-purchases',
            icon: CartIcon,
            forPermission: PurchasePermission.READ,
        },

        {
            label: 'Penjualan',
            href: '/repair-shop/sales',
            icon: PointOfSaleIcon,
            forPermission: SalePermission.READ,
        },
    ],
}
