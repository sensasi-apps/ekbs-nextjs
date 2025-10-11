// types

// icons-materials
import AllInbox from '@mui/icons-material/AllInbox'
import Inventory from '@mui/icons-material/Inventory'
import PointOfSale from '@mui/icons-material/PointOfSale'
import QueryStats from '@mui/icons-material/QueryStats'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
// enums
import Mart from '@/enums/permissions/Mart'
import type NavItemGroup from '../types/nav-item-group'

export const martsNavItemGroup: NavItemGroup = {
    items: [
        // {
        //     label: 'Kas',
        //     href: '/marts/cashes',
        //     icon: AutoStories,
        //     forPermission: Mart.READ_SALE_REPORT,
        // },
        {
            forPermission: Mart.READ_SALE_REPORT,
            href: '/marts/statistics',
            icon: QueryStats,
            label: 'Statistik',
        },
        {
            forPermission: Mart.READ_PRODUCT,
            href: '/marts/products',
            icon: Inventory,
            label: 'Produk',
        },
        {
            forPermission: Mart.READ_PURCHASE,
            href: '/marts/products/purchases',
            icon: ShoppingCart,
            label: 'Pembelian',
        },
        {
            forPermission: Mart.READ_OPNAME,
            href: '/marts/products/opnames',
            icon: AllInbox,
            label: 'Opname',
        },
        {
            forPermission: Mart.READ_SALE,
            href: '/mart-product-sales',
            icon: PointOfSale,
            label: 'Penjualan',
        },
    ],
    label: 'Belayan Mart',
}
