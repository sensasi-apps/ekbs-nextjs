import ChecklistIcon from '@mui/icons-material/Checklist'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import type NavItem from './NavItem.type'
import GroupTitle from './GroupTitle'
import Role from '@/enums/Role'

const farmInputNavItems: NavItem[] = [
    {
        children: <GroupTitle>Saprodi</GroupTitle>,
    },
    {
        href: '/farm-inputs/products',
        label: 'Produk',
        pathname: '/farm-inputs/products',
        icon: <InventoryIcon />,
        forRole: Role.FARM_INPUT_MANAGER,
    },
    {
        href: '/farm-input-product-in-outs',
        label: 'Barang Keluar-Masuk',
        pathname: '/farm-input-product-in-outs',
        icon: <WarehouseIcon />,
        forRole: [Role.FARM_INPUT_MANAGER, Role.FARM_INPUT_WAREHOUSE_MANAGER],
    },
    {
        href: '/farm-input-product-opnames',
        label: 'Opname',
        pathname: '/farm-input-product-opnames',
        icon: <ChecklistIcon />,
        forRole: [Role.FARM_INPUT_MANAGER, Role.FARM_INPUT_WAREHOUSE_MANAGER],
    },
    {
        href: '/farm-inputs/product-purchases',
        label: 'Pembelian',
        pathname: '/farm-inputs/product-purchases',
        icon: <ShoppingCartIcon />,
        forRole: [Role.FARM_INPUT_MANAGER, Role.FARM_INPUT_PURCHASER],
    },
    {
        href: '/farm-input-product-sales',
        label: 'Penjualan',
        pathname: [
            '/farm-input-product-sales',
            '/farm-input-product-sales/report',
        ],
        icon: <ReceiptIcon />,
        forRole: [Role.FARM_INPUT_MANAGER, Role.FARM_INPUT_SALES],
    },
    {
        href: '/farm-input-he-gas-sales',
        label: 'Penjualan BBM ke Alat Berat',
        pathname: '/farm-input-he-gas-sales',
        icon: <LocalGasStationIcon />,
        forRole: [Role.FARM_INPUT_MANAGER, Role.FARM_INPUT_SALES],
    },
    {
        href: '/katalog-saprodi',
        label: 'Katalog',
        pathname: '/katalog-saprodi',
        icon: <WarehouseIcon />,
    },
]

export default farmInputNavItems
