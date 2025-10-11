// types

// icons-materials
import Assessment from '@mui/icons-material/Assessment'
import Dashboard from '@mui/icons-material/Dashboard'
import SettingIcon from '@mui/icons-material/Settings'
import VolunteerActivism from '@mui/icons-material/VolunteerActivism'
// enums
import Role from '@/enums/role'
import type NavItemGroup from '../types/nav-item-group'
// nav items
import { clms } from './clm'
import { executives } from './executives'
import { farmInputsNavItemGroup } from './farm-Inputs'
import { financesNavItemGroup } from './finances'
import { heavyEquipments } from './heavy-equipments'
import { inventories } from './inventories'
import { loans } from './loans'
import { martsNavItemGroup } from './marts'
import { palmBunches } from './palm-bunches'
import { repairShop } from './repair-shop'
import { supermans } from './supermans'
import { systemsNavItemGroup } from './systems'

const NAV_ITEM_GROUPS: NavItemGroup[] = [
    {
        items: [
            {
                href: '/dashboard',
                icon: Dashboard,
                label: 'Dasbor',
            },
            {
                href: '/laporan-performa',
                icon: Assessment,
                label: 'Performa Koperasi',
            },
            {
                forRole: Role.MEMBER,
                href: '/me/participation',
                icon: VolunteerActivism,
                label: 'Partisipasiku',
            },
        ],
    },

    executives,
    palmBunches,
    loans,
    farmInputsNavItemGroup,
    inventories,
    heavyEquipments,
    martsNavItemGroup,
    repairShop,
    clms,
    financesNavItemGroup,
    systemsNavItemGroup,
    supermans,
    {
        items: [
            {
                href: '/settings',
                icon: SettingIcon,
                label: 'Pengaturan',
            },
        ],
    },
]

export default NAV_ITEM_GROUPS
