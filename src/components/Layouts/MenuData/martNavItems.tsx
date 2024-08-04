// types
import type NavItem from './NavItem.type'
// icons
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import InventoryIcon from '@mui/icons-material/Inventory'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
// page components
import GroupTitle from './GroupTitle'

const martNavItems: NavItem[] = [
    {
        children: <GroupTitle>Belayan Mart</GroupTitle>,
        // forPermission: [
        //     UserLoan.READ,
        //     UserLoan.READ_NEED_REVIEW,
        //     UserLoan.READ_NEED_DISBURSE,
        //     UserLoan.READ_INSTALLMENT,
        //     UserLoan.READ_OWN,
        //     UserLoan.READ_STATISTIC,
        // ],
    },
    {
        label: 'Kas',
        href: '/marts/cashes',
        icon: <AutoStoriesIcon />,
        // forPermission: FarmInput.READ_STATISTIC,
    },
    {
        href: '/marts/products',
        label: 'Produk',
        icon: <InventoryIcon />,
        // forPermission: UserLoan.READ_NEED_DISBURSE,
    },
    {
        href: '/marts/purchases',
        label: 'Pembelian',
        icon: <ShoppingCartIcon />,
        // forPermission: UserLoan.READ_NEED_DISBURSE,
    },
    {
        href: '/marts/sales',
        label: 'Penjualan',
        icon: <PointOfSaleIcon />,
        // forPermission: UserLoan.READ_NEED_DISBURSE,
    },
]

export default martNavItems
