// types
import type { NavItemGroup } from '../@types/nav-item-group'
// icons
import { Group, SupervisedUserCircle } from '@mui/icons-material'
// enums
import Role from '@/enums/Role'

export const supermans: NavItemGroup = {
    label: 'Superman',
    items: [
        {
            href: '/roles',
            label: 'Peran',
            pathname: '/roles',
            icon: SupervisedUserCircle,
            forRole: Role.SUPERMAN,
        },
        {
            href: '/acting-as',
            label: 'Acting As',
            pathname: '/acting-as',
            icon: Group,
            forRole: Role.SUPERMAN,
        },
    ],
}
