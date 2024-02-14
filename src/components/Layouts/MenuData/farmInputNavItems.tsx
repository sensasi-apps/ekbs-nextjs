// types
import type NavItem from './NavItem.type'
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ChecklistIcon from '@mui/icons-material/Checklist'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import WarehouseIcon from '@mui/icons-material/Warehouse'
// page components
import GroupTitle from './GroupTitle'
// enums
import FarmInput from '@/enums/permissions/FarmInput'

const farmInputNavItems: NavItem[] = [
    {
        children: <GroupTitle>Saprodi</GroupTitle>,
    },
    {
        href: '/farm-inputs/products',
        label: 'Produk',
        pathname: '/farm-inputs/products',
        icon: <InventoryIcon />,
        forPermission: [FarmInput.CREATE_PRODUCT, FarmInput.UPDATE_PRODUCT],
    },
    {
        label: 'Statistik',
        href: '/farm-inputs/statistics',
        pathname: '/farm-inputs/statistics',
        icon: <AlignHorizontalLeftIcon />,
        forPermission: [FarmInput.READ_STATISTIC],
    },
    {
        label: 'Piutang',
        href: '/farm-inputs/receivables',
        pathname: '/farm-inputs/receivables',
        icon: <CreditCardIcon />,
        forPermission: [FarmInput.READ_RECEIVABLE],
    },
    {
        href: '/farm-input-product-in-outs',
        label: 'Barang Keluar-Masuk',
        pathname: '/farm-input-product-in-outs',
        icon: <WarehouseIcon />,
        forPermission: [FarmInput.READ_STATISTIC],
    },
    {
        href: '/farm-input-product-opnames',
        label: 'Opname',
        pathname: '/farm-input-product-opnames',
        icon: <ChecklistIcon />,
        forPermission: [FarmInput.READ_STATISTIC],
    },
    {
        href: '/farm-inputs/product-purchases',
        label: 'Pembelian',
        pathname: '/farm-inputs/product-purchases',
        icon: <ShoppingCartIcon />,
        forPermission: [FarmInput.READ_PRODUCT_PURCHASE],
    },
    {
        href: '/farm-input-product-sales',
        label: 'Penjualan',
        pathname: [
            '/farm-input-product-sales',
            '/farm-input-product-sales/report',
        ],
        icon: <ReceiptIcon />,
        forPermission: [FarmInput.READ_PRODUCT_SALE],
    },
    {
        href: '/farm-input-he-gas-sales',
        label: 'Penjualan BBM ke Alat Berat',
        pathname: '/farm-input-he-gas-sales',
        icon: <LocalGasStationIcon />,
        forPermission: [FarmInput.READ_PRODUCT_SALE],
    },
    {
        href: '/katalog-saprodi',
        label: 'Katalog',
        pathname: '/katalog-saprodi',
        icon: <WarehouseIcon />,
    },
]

export default farmInputNavItems
