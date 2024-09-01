// types
import type NavItem from './NavItem.type'
// icons
import AllInboxIcon from '@mui/icons-material/AllInbox'
import InventoryIcon from '@mui/icons-material/Inventory'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
// icons
import QueryStatsIcon from '@mui/icons-material/QueryStats'
// page components
import GroupTitle from './GroupTitle'
// enums
import Mart from '@/enums/permissions/Mart'

const martNavItems: NavItem[] = [
    {
        children: <GroupTitle>Belayan Mart</GroupTitle>,
        forPermission: [Mart.READ_PRODUCT, Mart.READ_PURCHASE, Mart.READ_SALE],
    },
    // {
    //     label: 'Kas',
    //     href: '/marts/cashes',
    //     icon: <AutoStoriesIcon />,
    //     forPermission: Mart.READ_SALE_REPORT,
    // },
    {
        label: 'Statistik',
        href: '/marts/statistics',
        icon: <QueryStatsIcon />,
        forPermission: Mart.READ_SALE_REPORT,
    },
    {
        href: '/marts/products',
        label: 'Produk',
        icon: <InventoryIcon />,
        forPermission: Mart.READ_PRODUCT,
    },
    {
        href: '/marts/products/purchases',
        label: 'Pembelian',
        icon: <ShoppingCartIcon />,
        forPermission: Mart.READ_PURCHASE,
    },
    {
        href: '/marts/products/opnames',
        label: 'Opname',
        icon: <AllInboxIcon />,
        forPermission: Mart.READ_OPNAME,
    },
    {
        href: '/marts/products/sales',
        label: 'Penjualan',
        icon: <PointOfSaleIcon />,
        forPermission: Mart.READ_SALE,
    },
]

export default martNavItems
