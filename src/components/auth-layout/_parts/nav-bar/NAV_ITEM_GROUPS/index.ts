// types
import type NavItemGroup from '../types/nav-item-group'
// icons-materials
import Assessment from '@mui/icons-material/Assessment'
import Dashboard from '@mui/icons-material/Dashboard'
import VolunteerActivism from '@mui/icons-material/VolunteerActivism'
// nav items
import { clms } from './clm'
import { executives } from './executives'
import { farmInputsNavItemGroup } from './farm-Inputs'
import { financesNavItemGroup } from './finances'
import { heavyEquipments } from './heavy-equipments'
import { inventories } from './inventories'
import { loans } from './loans'
import { palmBunches } from './palm-bunches'
import { supermans } from './supermans'
import { systemsNavItemGroup } from './systems'
import { martsNavItemGroup } from './marts'
import { repairShop } from './repair-shop'
// enums
import Role from '@/enums/Role'

const NAV_ITEM_GROUPS: NavItemGroup[] = [
    {
        items: [
            {
                href: '/dashboard',
                label: 'Dasbor',
                icon: Dashboard,
            },
            {
                href: '/laporan-performa',
                label: 'Performa Koperasi',
                icon: Assessment,
            },
            {
                href: '/me/participation',
                label: 'Partisipasiku',
                icon: VolunteerActivism,
                forRole: Role.MEMBER,
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
]

export default NAV_ITEM_GROUPS
