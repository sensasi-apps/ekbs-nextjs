// types
import type { NavItemGroup } from '../@types/nav-item-group'
// icons-materials
import Assessment from '@mui/icons-material/Assessment'
import Dashboard from '@mui/icons-material/Dashboard'
import VolunteerActivism from '@mui/icons-material/VolunteerActivism'
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
import Role from '@/enums/Role'

export const NAV_ITEM_GROUPS: NavItemGroup[] = [
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
                href: '/me/participations',
                label: 'Partisipasi Anda',
                icon: VolunteerActivism,
                forRole: Role.MEMBER,
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
