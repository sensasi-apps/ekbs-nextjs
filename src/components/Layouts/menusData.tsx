// types
import type NavItem from './MenuData/NavItem.type'
// icons
import AssessmentIcon from '@mui/icons-material/Assessment'
import DashboardIcon from '@mui/icons-material/Dashboard'
// nav items
import accountingNavItems from './MenuData/accountingNavItems'
import executiveNavItems from './MenuData/executiveNavItems'
import farmInputNavItems from './MenuData/farmInputNavItems'
import heavyEquipmentNavItems from './MenuData/heavyEquipmentNavItems'
import inventoryNavItems from './MenuData/inventoryNavItems'
import loanNavItems from './MenuData/loanNavItems'
import palmBunchNavItems from './MenuData/palmBunchNavItems'
import supermanNavItems from './MenuData/supermanNavItems'
import systemNavItems from './MenuData/systemNavItems'

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
    ...loanNavItems,
    ...farmInputNavItems,
    ...inventoryNavItems,
    ...heavyEquipmentNavItems,
    ...accountingNavItems,
    ...systemNavItems,
    ...supermanNavItems,
]

export default NAV_ITEMS
