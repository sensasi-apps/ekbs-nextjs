// types
import type NavItem from './NavItem.type'
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import CreditCardIcon from '@mui/icons-material/CreditCard'
// import ChecklistIcon from '@mui/icons-material/Checklist'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import WarehouseIcon from '@mui/icons-material/Warehouse'

// page components
import GroupTitle from './GroupTitle'
// enums
import FarmInput from '@/enums/permissions/FarmInput'
import Role from '@/enums/Role'

const farmInputNavItems: NavItem[] = [
    {
        children: <GroupTitle>Saprodi</GroupTitle>,
    },
    {
        href: '/farm-inputs/products',
        label: 'Produk',
        icon: <InventoryIcon />,
        forPermission: [FarmInput.CREATE_PRODUCT, FarmInput.UPDATE_PRODUCT],
    },
    {
        label: 'Statistik',
        href: '/farm-inputs/statistics',
        icon: <AlignHorizontalLeftIcon />,
        forPermission: FarmInput.READ_STATISTIC,
    },
    {
        label: 'Kas',
        href: '/farm-inputs/cashes',
        icon: <AutoStoriesIcon />,
        forPermission: FarmInput.READ_STATISTIC,
    },
    {
        label: 'Piutang',
        href: '/farm-inputs/receivables',
        icon: <CreditCardIcon />,
        forPermission: FarmInput.READ_RECEIVABLE,
    },
    // {
    //     href: '/farm-input-product-in-outs',
    //     label: 'Barang Keluar-Masuk',
    //     icon: <WarehouseIcon />,
    //     forPermission: FarmInput.READ_STATISTIC,
    // },
    // {
    //     href: '/farm-input-product-opnames',
    //     label: 'Opname',
    //     icon: <ChecklistIcon />,
    //     forPermission: FarmInput.READ_STATISTIC,
    // },
    {
        href: '/farm-inputs/product-purchases',
        label: 'Pembelian',
        icon: <ShoppingCartIcon />,
        forPermission: FarmInput.READ_PRODUCT_PURCHASE,
    },
    {
        href: '/farm-input-product-sales',
        label: 'Penjualan',
        pathname: [
            '/farm-input-product-sales',
            '/farm-input-product-sales/report',
        ],
        icon: <ReceiptIcon />,
        forRole: [
            // TODO: change to permission based
            Role.FARM_INPUT_SALES_MUAI_WAREHOUSE,
            Role.FARM_INPUT_SALES_PULAU_PINANG_WAREHOUSE,
            Role.FARM_INPUT_MANAGER,
        ],
    },
    {
        href: '/farm-input-he-gas-sales',
        label: 'Penjualan BBM ke Alat Berat',
        icon: <LocalGasStationIcon />,
        forRole: [
            // TODO: change to permission based
            Role.FARM_INPUT_SALES_MUAI_WAREHOUSE,
            Role.FARM_INPUT_MANAGER,
        ],
    },
    {
        href: '/katalog-saprodi',
        label: 'Katalog',
        icon: <WarehouseIcon />,
    },
]

export default farmInputNavItems
