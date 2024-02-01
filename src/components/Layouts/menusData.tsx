// icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AssessmentIcon from '@mui/icons-material/Assessment'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EventNoteIcon from '@mui/icons-material/EventNote'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import SettingsIcon from '@mui/icons-material/Settings'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import WarehouseIcon from '@mui/icons-material/Warehouse'
//enums
import Role from '@/enums/Role'
import Cash from '@/enums/permissions/Cash'
// nav items
import supermanNavItems from './MenuData/supermanNavItems'
import inventoryNavItems from './MenuData/inventoryNavItems'
import palmBunchNavItems from './MenuData/palmBunchNavItems'
import NavItem from './MenuData/NavItem.type'
import GroupTitle from './MenuData/GroupTitle'
import executiveNavItems from './MenuData/executiveNavItems'

const loanNavs: NavItem[] = [
    {
        children: <GroupTitle>Simpan Pinjam</GroupTitle>,
        forRole: [Role.MEMBER, Role.EMPLOYEE],
    },
    {
        href: '/loans',
        label: 'Pinjaman Anda',
        pathname: '/loans',
        icon: <CurrencyExchangeIcon />,
        forRole: [Role.MEMBER, Role.EMPLOYEE],
    },
    {
        href: '/user-loans',
        label: 'Kelola',
        pathname: '/user-loans',
        icon: <BackupTableIcon />,
        forRole: Role.USER_LOAN_MANAGER,
    },
    {
        href: '/user-loans/reviews',
        label: 'Persetujuan',
        pathname: '/user-loans/reviews',
        icon: <RateReviewIcon />,
        forRole: Role.USER_LOAN_REVIEWER,
    },
    {
        href: '/user-loans/disburses',
        label: 'Pencairan',
        pathname: '/user-loans/disburses',
        icon: <RequestQuoteIcon />,
        forRole: Role.USER_LOAN_DISBURSER,
    },
    {
        href: '/user-loans/installments',
        label: 'Angsuran',
        pathname: '/user-loans/installments',
        icon: <PointOfSaleIcon />,
        forRole: Role.USER_LOAN_INSTALLMENT_COLLECTOR,
    },
]

const farmInputNavs: NavItem[] = [
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

const heavyEquipmentNavs: NavItem[] = [
    {
        children: <GroupTitle>Alat Berat</GroupTitle>,
        forRole: [
            Role.HEAVY_EQUIPMENT_RENT_ADMIN,
            Role.HEAVY_EQUIPMENT_RENT_MANAGER,
            Role.HEAVY_EQUIPMENT_RENT_OPERATOR,
        ],
    },
    {
        href: '/heavy-equipment-rents',
        label: 'Penyewaan',
        pathname: '/heavy-equipment-rents',
        icon: <EventNoteIcon />,
        forRole: [
            Role.HEAVY_EQUIPMENT_RENT_MANAGER,
            Role.HEAVY_EQUIPMENT_RENT_ADMIN,
        ],
    },
    {
        href: '/heavy-equipment-rents/tasks',
        label: 'Tugas',
        pathname: '/heavy-equipment-rents/tasks',
        icon: <EventNoteIcon />,
        forRole: [
            Role.HEAVY_EQUIPMENT_RENT_MANAGER,
            Role.HEAVY_EQUIPMENT_RENT_OPERATOR,
        ],
    },
]

const accountingNavs: NavItem[] = [
    {
        children: <GroupTitle>Keuangan</GroupTitle>,
        forRole: [Role.MEMBER, Role.EMPLOYEE, Role.CASH_MANAGER],
    },
    {
        href: '/wallet',
        label: 'Wallet',
        pathname: '/wallet',
        icon: <AccountBalanceWalletIcon />,
        forRole: [Role.MEMBER, Role.EMPLOYEE],
    },
    {
        href: '/bills',
        label: 'Tagihan',
        pathname: '/bills',
        icon: <ReceiptLongIcon />,
        forPermission: Cash.READ_OWN_INSTALLMENT,
    },
    {
        href: '/cashes',
        label: 'Kas',
        pathname: '/cashes',
        icon: <AutoStoriesIcon />,
        forRole: Role.CASH_MANAGER,
    },
    {
        href: '/wallets',
        label: 'Wallet Pengguna',
        pathname: '/wallets',
        icon: <AccountBalanceWalletIcon />,
        forRole: Role.CASH_MANAGER,
    },
    {
        href: '/receivables',
        label: 'Piutang',
        pathname: '/receivables',
        icon: <CreditScoreIcon />,
        forPermission: Cash.READ_ALL_INSTALLMENT,
    },
]

const settingsNavs: NavItem[] = [
    {
        children: <GroupTitle>Sistem</GroupTitle>,
        forRole: [Role.USER_ADMIN, Role.SYSTEM_CONFIGURATOR],
    },
    {
        href: '/users',
        label: 'Pengguna',
        pathname: '/users/[[...uuid]]',
        icon: <GroupIcon />,
        forRole: Role.USER_ADMIN,
    },
    {
        href: '/settings',
        label: 'Pengaturan',
        pathname: '/settings',
        icon: <SettingsIcon />,
        forRole: Role.SYSTEM_CONFIGURATOR,
    },
]

const NAV_ITEMS: NavItem[] = [
    {
        href: '/dashboard',
        label: 'Dasbor',
        pathname: '/dashboard',
        icon: <DashboardIcon />,
    },
    {
        href: '/laporan-performa',
        label: 'Performa Koperasi',
        pathname: '/laporan-performa',
        icon: <AssessmentIcon />,
    },

    ...executiveNavItems,
    ...palmBunchNavItems,
    ...loanNavs,
    ...farmInputNavs,
    ...inventoryNavItems,
    ...heavyEquipmentNavs,
    ...accountingNavs,
    ...settingsNavs,
    ...supermanNavItems,
]

export default NAV_ITEMS
