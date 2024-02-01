// vendors
import { memo } from 'react'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
// icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AssessmentIcon from '@mui/icons-material/Assessment'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import BalanceIcon from '@mui/icons-material/Balance'
import BiotechIcon from '@mui/icons-material/Biotech'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EventNoteIcon from '@mui/icons-material/EventNote'
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList'
import FireTruckIcon from '@mui/icons-material/FireTruck'
import GrassIcon from '@mui/icons-material/Grass'
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
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import WarehouseIcon from '@mui/icons-material/Warehouse'
//enums
import Role from '@/enums/Role'
import PalmBunch from '@/enums/permissions/PalmBunch'
import Cash from '@/enums/permissions/Cash'

const GroupTitle = memo(function GroupTitle({
    children,
}: {
    children: string
}) {
    return (
        <>
            <Divider
                style={{
                    marginTop: '1rem',
                }}
            />
            <Typography
                ml={2}
                mt={2}
                variant="overline"
                color="grey"
                fontWeight="bold"
                component="div">
                {children}
            </Typography>
        </>
    )
})

const inventoryNavs: NavItem[] = [
    {
        children: <GroupTitle>Inventaris</GroupTitle>,
    },
    {
        href: '/inventory-items',
        label: 'Barang',
        pathname: ['/inventory-items', '/inventory-items/[uuid]'],
        icon: <FeaturedPlayListIcon />,
    },
]

const palmBunchNavs: NavItem[] = [
    {
        children: <GroupTitle>Tandan Buah Segar</GroupTitle>,
        forRole: [
            Role.PALM_BUNCH_ADMIN,
            Role.PALM_BUNCH_MANAGER,
            Role.FARMER,
            Role.COURIER,
        ],
    },
    {
        href: '/palm-bunches/performances',
        label: 'Performa Anda',
        pathname: '/palm-bunches/performances',
        icon: <AssessmentIcon />,
        forRole: [Role.FARMER, Role.COURIER],
    },
    {
        href: '/palm-bunches/rates',
        label: 'Harga TBS',
        pathname: '/palm-bunches/rates',
        icon: <GrassIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
    {
        href: '/palm-bunches/delivery-rates',
        label: 'Tarif Angkut',
        pathname: '/palm-bunches/delivery-rates',
        icon: <FireTruckIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
    {
        href: '/palm-bunches/rea-tickets',
        label: 'Tiket REA',
        pathname: '/palm-bunches/rea-tickets',
        icon: <BalanceIcon />,
        forPermission: PalmBunch.READ_TICKET,
    },
    {
        href: '/palm-bunches/rea-payments',
        label: 'Pembayaran REA',
        pathname: '/palm-bunches/rea-payments',
        icon: <PointOfSaleIcon />,
        forRole: Role.PALM_BUNCH_MANAGER,
    },
]

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

const supermanNavs: NavItem[] = [
    {
        children: <GroupTitle>Superman</GroupTitle>,
        forRole: Role.SUPERMAN,
    },
    {
        href: `${process.env.NEXT_PUBLIC_BACKEND_URL}/_/telescope`,
        label: 'Telescope',
        pathname: '/_/telescope',
        icon: <BiotechIcon />,
        forRole: Role.SUPERMAN,
    },
    {
        href: '/roles',
        label: 'Peran',
        pathname: '/roles',
        icon: <SupervisedUserCircleIcon />,
        forRole: Role.SUPERMAN,
    },
    {
        href: '/acting-as',
        label: 'Acting As',
        pathname: '/acting-as',
        icon: <GroupIcon />,
        forRole: Role.SUPERMAN,
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

    ...palmBunchNavs,
    ...loanNavs,
    ...farmInputNavs,
    ...inventoryNavs,
    ...heavyEquipmentNavs,
    ...accountingNavs,
    ...settingsNavs,
    ...supermanNavs,
]

export default NAV_ITEMS

export type NavItem = NavItemComponent | NavItemLink

type NavItemComponent = {
    href?: never
    label?: never
    pathname?: never
    icon?: never

    children: JSX.Element
    forRole?: Role | Role[]
    forPermission?: string | string[]
}

type NavItemLink = {
    children?: never

    href: string
    label: string
    pathname: string | string[]
    icon: JSX.Element
    forRole?: Role | Role[]
    forPermission?: string | string[]
}
