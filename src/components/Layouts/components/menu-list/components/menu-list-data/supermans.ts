// types
import type { NavItemGroup } from '../@types/nav-item-group'
// icons
import { Biotech, Group, Note, SupervisedUserCircle } from '@mui/icons-material'
// enums
import Role from '@/enums/Role'

export const supermans: NavItemGroup = {
    label: 'Superman',
    items: [
        {
            href: '/roles',
            label: 'Peran',
            icon: SupervisedUserCircle,
            forRole: Role.SUPERMAN,
        },
        {
            href: '/acting-as',
            label: 'Acting As',
            icon: Group,
            forRole: Role.SUPERMAN,
        },
        {
            href: '/_/logs',
            label: 'Logs',
            icon: Note,
            forRole: Role.SUPERMAN,
        },
        {
            href: '/_/test',
            label: 'Test',
            icon: Biotech,
            forRole: Role.SUPERMAN,
        },
    ],
}
