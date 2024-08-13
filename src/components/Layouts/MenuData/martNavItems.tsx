// types
import type NavItem from './NavItem.type'
// icons
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import InventoryIcon from '@mui/icons-material/Inventory'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
// page components
import GroupTitle from './GroupTitle'
// enums
import Mart from '@/enums/permissions/Mart'

const martNavItems: NavItem[] = [
    {
        children: <GroupTitle>Belayan Mart</GroupTitle>,
        forPermission: [
            Mart.READ_CASH,
            Mart.READ_PRODUCT,
            Mart.READ_PURCHASE,
            Mart.READ_SALE,
        ],
    },
    {
        label: 'Kas',
        href: '/marts/cashes',
        icon: <AutoStoriesIcon />,
        forPermission: Mart.READ_CASH,
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
        href: '/marts/products/sales',
        label: 'Penjualan',
        icon: <PointOfSaleIcon />,
        forPermission: Mart.READ_SALE,
    },
]

export default martNavItems
