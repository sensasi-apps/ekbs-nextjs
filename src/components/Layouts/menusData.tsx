// vendors
import { memo } from 'react'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
// icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import BalanceIcon from '@mui/icons-material/Balance'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
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
import SettingsIcon from '@mui/icons-material/Settings'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import Role from '@/enums/Role'

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
        forRole: [Role.PALM_BUNCH_ADMIN, Role.PALM_BUNCH_MANAGER],
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
        forRole: [Role.PALM_BUNCH_ADMIN, Role.PALM_BUNCH_MANAGER],
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
        component: <GroupTitle>Simpan Pinjam</GroupTitle>,
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
        component: <GroupTitle>Saprodi</GroupTitle>,
        forRole: [
            Role.FARM_INPUT_MANAGER,
            Role.FARM_INPUT_PURCHASER,
            Role.FARM_INPUT_WAREHOUSE_MANAGER,
            Role.FARM_INPUT_SALES,
        ],
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
        forRole: Role.FARM_INPUT_WAREHOUSE_MANAGER,
    },
    {
        href: '/farm-input-product-opnames',
        label: 'Opname',
        pathname: '/farm-input-product-opnames',
        icon: <ChecklistIcon />,
        forRole: Role.FARM_INPUT_WAREHOUSE_MANAGER,
    },
    {
        href: '/farm-inputs/product-purchases',
        label: 'Pembelian',
        pathname: '/farm-inputs/product-purchases',
        icon: <ShoppingCartIcon />,
        forRole: Role.FARM_INPUT_PURCHASER,
    },
    {
        href: '/farm-input-product-sales',
        label: 'Penjualan',
        pathname: '/farm-input-product-sales',
        icon: <ReceiptIcon />,
        forRole: Role.FARM_INPUT_SALES,
    },
    {
        href: '/farm-input-he-gas-sales',
        label: 'Penjualan BBM ke Alat Berat',
        pathname: '/farm-input-he-gas-sales',
        icon: <LocalGasStationIcon />,
        forRole: Role.FARM_INPUT_SALES,
    },
]

const accountingNavs: NavItem[] = [
    {
        component: <GroupTitle>Keuangan</GroupTitle>,
        forRole: [Role.MEMBER, Role.EMPLOYEE, Role.CASH_MANAGER],
    },
    {
        href: '/wallet',
        label: 'Wallet Anda',
        pathname: '/wallet',
        icon: <AccountBalanceWalletIcon />,
        forRole: [Role.MEMBER, Role.EMPLOYEE],
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
]

const settingsNavs: NavItem[] = [
    {
        component: <GroupTitle>Sistem</GroupTitle>,
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
        component: <GroupTitle>Superman</GroupTitle>,
        forRole: Role.SUPERMAN,
    },
    {
        href: '/roles',
        label: 'Peran',
        pathname: '/roles',
        icon: <GroupIcon />,
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

    ...palmBunchNavs,
    ...loanNavs,
    ...farmInputNavs,
    ...inventoryNavs,
    {
        component: <GroupTitle>Alat Berat</GroupTitle>,
        forRole: Role.HEAVY_EQUIPMENT_RENT_ADMIN,
    },
    {
        href: '/heavy-equipment-rents',
        label: 'Penyewaan',
        pathname: '/heavy-equipment-rents',
        icon: <EventNoteIcon />,
        forRole: Role.HEAVY_EQUIPMENT_RENT_ADMIN,
    },
    ...accountingNavs,
    ...settingsNavs,
    ...supermanNavs,
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
