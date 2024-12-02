// types
import type { NavItemGroup } from '../@types/nav-item-group'
// icons
import {
    AllInbox,
    // AutoStories,
    Inventory,
    PointOfSale,
    QueryStats,
    ShoppingCart,
} from '@mui/icons-material'
// enums
import Mart from '@/enums/permissions/Mart'

export const marts: NavItemGroup = {
    label: 'Belayan Mart',
    items: [
        // {
        //     label: 'Kas',
        //     href: '/marts/cashes',
        //     icon: AutoStories,
        //     forPermission: Mart.READ_SALE_REPORT,
        // },
        {
            label: 'Statistik',
            href: '/marts/statistics',
            icon: QueryStats,
            forPermission: Mart.READ_SALE_REPORT,
        },
        {
            href: '/marts/products',
            label: 'Produk',
            icon: Inventory,
            forPermission: Mart.READ_PRODUCT,
        },
        {
            href: '/marts/products/purchases',
            label: 'Pembelian',
            icon: ShoppingCart,
            forPermission: Mart.READ_PURCHASE,
        },
        {
            href: '/marts/products/opnames',
            label: 'Opname',
            icon: AllInbox,
            forPermission: Mart.READ_OPNAME,
            pathname: [
                '/marts/products/opnames',
                '/marts/products/opnames/reports',
            ],
        },
        {
            href: '/marts/products/sales',
            label: 'Penjualan',
            icon: PointOfSale,
            forPermission: Mart.READ_SALE,
        },
    ],
}
