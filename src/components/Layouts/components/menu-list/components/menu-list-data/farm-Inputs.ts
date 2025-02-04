import type { NavItemGroup } from '../@types/nav-item-group'
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
import Role from '@/enums/Role'

export const farmInputs: NavItemGroup = {
    label: 'Saprodi',
    items: [
        {
            href: '/farm-inputs/products',
            label: 'Produk',
            icon: Inventory,
            forPermission: [FarmInput.CREATE_PRODUCT, FarmInput.UPDATE_PRODUCT],
        },
        {
            label: 'Statistik',
            href: '/farm-inputs/statistics',
            icon: AlignHorizontalLeft,
            forPermission: FarmInput.READ_STATISTIC,
        },
        {
            label: 'Kas',
            href: '/farm-inputs/cashes',
            icon: AutoStories,
            forPermission: FarmInput.READ_STATISTIC,
        },
        {
            label: 'Piutang',
            href: '/farm-inputs/receivables',
            icon: CreditCard,
            forPermission: FarmInput.READ_RECEIVABLE,
        },
        // {
        //     href: '/farm-input-product-in-outs',
        //     label: 'Barang Keluar-Masuk',
        //     icon: Warehouse,
        //     forPermission: FarmInput.READ_STATISTIC,
        // },
        // {
        //     href: '/farm-input-product-opnames',
        //     label: 'Opname',
        //     icon: Checklist,
        //     forPermission: FarmInput.READ_STATISTIC,
        // },
        {
            href: '/farm-inputs/product-purchases',
            label: 'Pembelian',
            icon: ShoppingCart,
            forPermission: FarmInput.READ_PRODUCT_PURCHASE,
        },
        {
            href: '/farm-input-product-sales',
            label: 'Penjualan',
            pathname: [
                '/farm-input-product-sales',
                '/farm-input-product-sales/report',
            ],
            icon: Receipt,
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
            icon: LocalGasStation,
            forRole: [
                // TODO: change to permission based
                Role.FARM_INPUT_SALES_MUAI_WAREHOUSE,
                Role.FARM_INPUT_MANAGER,
            ],
        },
        {
            href: '/katalog-saprodi',
            label: 'Katalog',
            icon: Warehouse,
        },

        // ################# USER CONTEXT SECTION #################
        {
            href: '/farm-inputs/purchases/me',
            label: 'Pembelian',
            icon: ShoppingCart,
        },
    ],
}
