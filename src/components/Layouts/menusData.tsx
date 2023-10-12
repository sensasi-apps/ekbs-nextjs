import { FC } from 'react'

import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import BalanceIcon from '@mui/icons-material/Balance'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FireTruckIcon from '@mui/icons-material/FireTruck'
// import ForestIcon from '@mui/icons-material/Forest'
import GrassIcon from '@mui/icons-material/Grass'
import GroupIcon from '@mui/icons-material/Group'
import HandymanIcon from '@mui/icons-material/Handyman'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import RateReviewIcon from '@mui/icons-material/RateReview'
import SettingsIcon from '@mui/icons-material/Settings'

const SubTitle: FC<{
    children: string
}> = ({ children }) => (
    <Typography ml={2} mt={2} variant="overline" color="grey" fontWeight="bold">
        {children}
    </Typography>
)

const menusData = [
    {
        href: '/dashboard',
        label: 'Dasbor',
        pathname: '/dashboard',
        icon: <DashboardIcon />,
        forRoles: [],
    },
    {
        component: <SubTitle>Unit</SubTitle>,
        forRoles: [],
    },
    {
        href: '/alat-berat',
        label: 'Alat Berat',
        pathname: '/alat-berat',
        icon: <AgricultureIcon />,
        forRoles: [],
    },
    {
        component: <Divider sx={{ mt: 2 }} />,
        forRoles: [
            'member',
            'employee',
            'user loans manager',
            'user loans reviewer',
            'user loans collector',
        ],
    },
    {
        component: <SubTitle>Tandan Buah Segar</SubTitle>,
        forRoles: ['palm bunches admin', 'palm bunch head'],
    },
    {
        href: '/palm-bunches/rates',
        label: 'Harga TBS',
        pathname: '/palm-bunches/rates',
        icon: <GrassIcon />,
        forRoles: ['palm bunch head'],
    },
    {
        href: '/palm-bunches/delivery-rates',
        label: 'Tarif Angkut',
        pathname: '/palm-bunches/delivery-rates',
        icon: <FireTruckIcon />,
        forRoles: ['palm bunch head'],
    },
    {
        href: '/palm-bunches/rea-tickets',
        label: 'Tiket REA',
        pathname: '/palm-bunches/rea-tickets',
        icon: <BalanceIcon />,
        forRoles: ['palm bunches admin'],
    },
    {
        href: '/palm-bunches/rea-payments',
        label: 'Pembayaran REA',
        pathname: '/palm-bunches/rea-payments',
        icon: <PointOfSaleIcon />,
        forRoles: ['palm bunch head'],
    },
    {
        component: <SubTitle>Simpan Pinjam</SubTitle>,
        forRoles: [
            'member',
            'employee',
            'user loans manager',
            'user loans disburser',
            'user loans reviewer',
            'user loans collector',
        ],
    },
    {
        href: '/loans',
        label: 'Pinjaman Anda',
        pathname: '/loans',
        icon: <CurrencyExchangeIcon />,
        forRoles: ['member', 'employee'],
    },
    {
        href: '/user-loans/reviews',
        label: 'Tinjau Pinjaman',
        pathname: '/user-loans/reviews',
        icon: <RateReviewIcon />,
        forRoles: ['user loans reviewer'],
    },
    {
        href: '/user-loans/disburses',
        label: 'Pencairan Pinjaman',
        pathname: '/user-loans/disburses',
        icon: <RequestQuoteIcon />,
        forRoles: ['user loans disburser'],
    },
    {
        href: '/user-loans/installments',
        label: 'Pembayaran Angsuran',
        pathname: '/user-loans/installments',
        icon: <PointOfSaleIcon />,
        forRoles: ['user loan installments collector'],
    },
    {
        href: '/user-loans',
        label: 'Kelola Pinjaman',
        pathname: '/user-loans',
        icon: <BackupTableIcon />,
        forRoles: ['user loans manager'],
    },
    {
        component: <Divider sx={{ mt: 2 }} />,
        forRoles: ['farm inputs manager'],
    },
    {
        component: <SubTitle>Saprodi</SubTitle>,
        forRoles: ['farm inputs manager'],
    },
    {
        href: '/farm-inputs/products',
        label: 'Produk',
        pathname: '/farm-inputs/products',
        icon: <HandymanIcon />,
        forRoles: ['farm inputs manager'],
    },
    {
        component: (
            <>
                <Divider sx={{ mt: 2 }} />
                <SubTitle>Keuangan</SubTitle>
            </>
        ),
        forRoles: ['member', 'employee', 'cashes manager'],
    },
    {
        href: '/wallet',
        label: 'Wallet Anda',
        pathname: '/wallet',
        icon: <AccountBalanceWalletIcon />,
        forRoles: ['member', 'employee'],
    },
    {
        href: '/cashes',
        label: 'Kas',
        pathname: '/cashes',
        icon: <AutoStoriesIcon />,
        forRoles: ['cashes manager'],
    },
    {
        href: '/wallets',
        label: 'Wallet Pengguna',
        pathname: '/wallets',
        icon: <AccountBalanceWalletIcon />,
        forRoles: ['cashes manager'],
    },
    {
        component: (
            <>
                <Divider sx={{ mt: 2 }} />
                <SubTitle>Sistem</SubTitle>
            </>
        ),
        forRoles: ['users admin'],
    },
    {
        href: '/users',
        label: 'Pengguna',
        pathname: '/users/[[...uuid]]',
        icon: <GroupIcon />,
        forRoles: ['users admin'],
    },
    {
        href: '/roles',
        label: 'Peran',
        pathname: '/roles',
        icon: <GroupIcon />,
        forRoles: ['superman'],
    },
    {
        href: '/settings',
        label: 'Pengaturan',
        pathname: '/settings',
        icon: <SettingsIcon />,
        forRoles: ['systems admin'],
    },
]

export default menusData
