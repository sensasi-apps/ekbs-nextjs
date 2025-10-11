// icons-materials
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft'
import AutoStories from '@mui/icons-material/AutoStories'
import CreditCard from '@mui/icons-material/CreditCard'
import Inventory from '@mui/icons-material/Inventory'
import LocalGasStation from '@mui/icons-material/LocalGasStation'
import Receipt from '@mui/icons-material/Receipt'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Warehouse from '@mui/icons-material/Warehouse'
// enums
import FarmInput from '@/enums/permissions/FarmInput'
import Role from '@/enums/role'
import type NavItemGroup from '../types/nav-item-group'

export const farmInputsNavItemGroup: NavItemGroup = {
    items: [
        // ################# USER CONTEXT SECTION #################
        {
            href: '/farm-inputs/my-purchases',
            icon: ShoppingCart,
            label: 'Pembelianku',
        },

        // ################
        {
            forPermission: [FarmInput.CREATE_PRODUCT, FarmInput.UPDATE_PRODUCT],
            href: '/farm-inputs/products',
            icon: Inventory,
            label: 'Produk',
        },
        {
            forPermission: FarmInput.READ_STATISTIC,
            href: '/farm-inputs/statistics',
            icon: AlignHorizontalLeft,
            label: 'Statistik',
        },
        {
            forPermission: FarmInput.READ_STATISTIC,
            href: '/farm-inputs/cashes',
            icon: AutoStories,
            label: 'Kas',
        },
        {
            forPermission: FarmInput.READ_RECEIVABLE,
            href: '/farm-inputs/receivables',
            icon: CreditCard,
            label: 'Piutang',
        },
        {
            forPermission: FarmInput.READ_PRODUCT_PURCHASE,
            href: '/farm-inputs/product-purchases',
            icon: ShoppingCart,
            label: 'Pembelian',
        },
        {
            forRole: [
                // TODO: change to permission based
                Role.FARM_INPUT_SALES_MUAI_WAREHOUSE,
                Role.FARM_INPUT_SALES_PULAU_PINANG_WAREHOUSE,
                Role.FARM_INPUT_MANAGER,
            ],
            href: '/farm-inputs/product-sales',
            icon: Receipt,
            label: 'Penjualan',
        },
        {
            forRole: [
                // TODO: change to permission based
                Role.FARM_INPUT_SALES_MUAI_WAREHOUSE,
                Role.FARM_INPUT_MANAGER,
            ],
            href: '/farm-inputs/he-gas-sales',
            icon: LocalGasStation,
            label: 'Penjualan BBM ke Alat Berat',
        },
        {
            href: '/katalog-saprodi',
            icon: Warehouse,
            label: 'Katalog',
        },
    ],
    label: 'Saprodi',
}
