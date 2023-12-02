// vendors
import { memo } from 'react'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
// icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import BalanceIcon from '@mui/icons-material/Balance'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList'
import FireTruckIcon from '@mui/icons-material/FireTruck'
import GrassIcon from '@mui/icons-material/Grass'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ReceiptIcon from '@mui/icons-material/Receipt'
import SettingsIcon from '@mui/icons-material/Settings'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import WarehouseIcon from '@mui/icons-material/Warehouse'

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
        component: <GroupTitle>Inventaris</GroupTitle>,
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
        component: <GroupTitle>Tandan Buah Segar</GroupTitle>,
        forRole: ['palm bunches admin', 'palm bunch head'],
    },
    {
        href: '/palm-bunches/rates',
        label: 'Harga TBS',
        pathname: '/palm-bunches/rates',
        icon: <GrassIcon />,
        forRole: 'palm bunch head',
    },
    {
        href: '/palm-bunches/delivery-rates',
        label: 'Tarif Angkut',
        pathname: '/palm-bunches/delivery-rates',
        icon: <FireTruckIcon />,
        forRole: 'palm bunch head',
    },
    {
        href: '/palm-bunches/rea-tickets',
        label: 'Tiket REA',
        pathname: '/palm-bunches/rea-tickets',
        icon: <BalanceIcon />,
        forRole: 'palm bunches admin',
    },
    {
        href: '/palm-bunches/rea-payments',
        label: 'Pembayaran REA',
        pathname: '/palm-bunches/rea-payments',
        icon: <PointOfSaleIcon />,
        forRole: 'palm bunch head',
    },
]

const loanNavs: NavItem[] = [
    {
        component: <GroupTitle>Simpan Pinjam</GroupTitle>,
        forRole: ['member', 'employee'],
    },
    {
        href: '/loans',
        label: 'Pinjaman Anda',
        pathname: '/loans',
        icon: <CurrencyExchangeIcon />,
        forRole: ['member', 'employee'],
    },
    {
        href: '/user-loans',
        label: 'Kelola',
        pathname: '/user-loans',
        icon: <BackupTableIcon />,
        forRole: 'user loans manager',
    },
    {
        href: '/user-loans/reviews',
        label: 'Persetujuan',
        pathname: '/user-loans/reviews',
        icon: <RateReviewIcon />,
        forRole: 'user loans reviewer',
    },
    {
        href: '/user-loans/disburses',
        label: 'Pencairan',
        pathname: '/user-loans/disburses',
        icon: <RequestQuoteIcon />,
        forRole: 'user loans disburser',
    },
    {
        href: '/user-loans/installments',
        label: 'Angsuran',
        pathname: '/user-loans/installments',
        icon: <PointOfSaleIcon />,
        forRole: 'user loan installments collector',
    },
]

const farmInputNavs: NavItem[] = [
    {
        component: <GroupTitle>Saprodi</GroupTitle>,
        forRole: [
            'farm inputs manager',
            'farm inputs purchaser',
            'farm input warehouse manager',
            'farm input sales',
        ],
    },
    {
        href: '/farm-inputs/products',
        label: 'Produk',
        pathname: '/farm-inputs/products',
        icon: <InventoryIcon />,
        forRole: 'farm inputs manager',
    },
    {
        href: '/farm-input-product-in-outs',
        label: 'Barang Keluar-Masuk',
        pathname: '/farm-input-product-in-outs',
        icon: <WarehouseIcon />,
        forRole: 'farm input warehouse manager',
    },
    {
        href: '/farm-input-product-opnames',
        label: 'Opname',
        pathname: '/farm-input-product-opnames',
        icon: <ChecklistIcon />,
        forRole: 'farm input warehouse manager',
    },
    {
        href: '/farm-inputs/product-purchases',
        label: 'Pembelian',
        pathname: '/farm-inputs/product-purchases',
        icon: <ShoppingCartIcon />,
        forRole: 'farm inputs purchaser',
    },
    {
        href: '/farm-input-product-sales',
        label: 'Penjualan',
        pathname: '/farm-input-product-sales',
        icon: <ReceiptIcon />,
        forRole: 'farm input sales',
    },
]

const accountingNavs: NavItem[] = [
    {
        component: <GroupTitle>Keuangan</GroupTitle>,
        forRole: ['member', 'employee', 'cashes manager'],
    },
    {
        href: '/wallet',
        label: 'Wallet Anda',
        pathname: '/wallet',
        icon: <AccountBalanceWalletIcon />,
        forRole: ['member', 'employee'],
    },
    {
        href: '/cashes',
        label: 'Kas',
        pathname: '/cashes',
        icon: <AutoStoriesIcon />,
        forRole: 'cashes manager',
    },
    {
        href: '/wallets',
        label: 'Wallet Pengguna',
        pathname: '/wallets',
        icon: <AccountBalanceWalletIcon />,
        forRole: 'cashes manager',
    },
]

const settingsNavs: NavItem[] = [
    {
        component: <GroupTitle>Sistem</GroupTitle>,
        forRole: 'users admin',
    },
    {
        href: '/users',
        label: 'Pengguna',
        pathname: '/users/[[...uuid]]',
        icon: <GroupIcon />,
        forRole: 'users admin',
    },
    {
        href: '/roles',
        label: 'Peran',
        pathname: '/roles',
        icon: <GroupIcon />,
        forRole: 'superman',
    },
    {
        href: '/settings',
        label: 'Pengaturan',
        pathname: '/settings',
        icon: <SettingsIcon />,
        forRole: 'systems admin',
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
        component: <GroupTitle>Unit</GroupTitle>,
    },
    {
        href: '/alat-berat',
        label: 'Alat Berat',
        pathname: '/alat-berat',
        icon: <AgricultureIcon />,
    },

    ...palmBunchNavs,
    ...loanNavs,
    ...farmInputNavs,
    ...inventoryNavs,
    ...accountingNavs,
    ...settingsNavs,
]

export default NAV_ITEMS

export type NavItem = {
    forRole?: string | string[]
    href?: string
    label?: string
    pathname?: string | string[]
    icon?: JSX.Element
    component?: JSX.Element
} & (
    | {
          href: string
          label: string
          pathname: string | string[]
          icon: JSX.Element
          component?: never
      }
    | {
          href?: never
          label?: never
          pathname?: never
          icon?: never
          component: JSX.Element
      }
)
