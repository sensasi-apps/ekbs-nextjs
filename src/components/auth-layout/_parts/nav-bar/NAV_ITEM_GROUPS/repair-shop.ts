import type NavItemGroup from '../types/nav-item-group'
// icons
import TopicIcon from '@mui/icons-material/Topic'
import CashIcon from '@mui/icons-material/AutoStories'
import CartIcon from '@mui/icons-material/ShoppingCart'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import SavingsIcon from '@mui/icons-material/Savings'
// enums
import PurchasePermission from '@/app/(auth)/repair-shop/spare-part-purchases/_parts/enums/permission'
import SparePartPermission from '@/modules/repair-shop/enums/permission'
import ServicePermission from '@/app/(auth)/repair-shop/services/_parts/enums/permission'
import SalePermission from '@/app/(auth)/repair-shop/sales/_parts/enums/permission'
import Role from '@/enums/role'

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
            forPermission: SparePartPermission.READ,
        },

        {
            label: 'Layanan',
            href: '/repair-shop/services',
            icon: TopicIcon,
            forPermission: ServicePermission.READ,
        },

        {
            label: 'Piutang',
            href: '/repair-shop/receivables',
            icon: SavingsIcon,
            forPermission: SalePermission.READ,
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

        {
            label: 'Kas',
            href: '/repair-shop/cashes',
            icon: CashIcon,
            forRole: Role.REPAIR_SHOP_MANAGER,
        },
    ],
}
