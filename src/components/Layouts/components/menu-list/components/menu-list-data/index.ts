// types
import type { NavItemGroup } from '../@types/nav-item-group'
// icons
import { Assessment, Dashboard } from '@mui/icons-material'
// nav items
import { accountings } from './accountings'
import { executives } from './executives'
import { farmInputs } from './farm-Inputs'
import { heavyEquipments } from './heavy-equipments'
import { inventories } from './inventories'
import { loans } from './loans'
import { palmBunches } from './palm-bunches'
import { supermans } from './supermans'
import { systems } from './systems'
import { marts } from './marts'

export const NAV_ITEM_GROUPS: NavItemGroup[] = [
    {
        items: [
            {
                href: '/dashboard',
                label: 'Dasbor',
                pathname: '/dashboard',
                icon: Dashboard,
            },
            {
                href: '/laporan-performa',
                label: 'Performa Koperasi',
                pathname: '/laporan-performa',
                icon: Assessment,
            },
        ],
    },

    executives,
    palmBunches,
    loans,
    farmInputs,
    inventories,
    heavyEquipments,
    marts,
    accountings,
    systems,
    supermans,
]
