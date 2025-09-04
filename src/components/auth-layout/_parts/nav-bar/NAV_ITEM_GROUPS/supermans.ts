// types
import type NavItemGroup from '../types/nav-item-group'
// icons-materials
import Biotech from '@mui/icons-material/Biotech'
import Group from '@mui/icons-material/Group'
import Note from '@mui/icons-material/Note'
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle'
import TicketIcon from '@mui/icons-material/LocalActivity'
// enums
import Role from '@/enums/role'

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
            href: '/logs',
            label: 'Logs',
            icon: Note,
            forRole: Role.SUPERMAN,
        },
        {
            href: '/test',
            label: 'Test',
            icon: Biotech,
            forRole: Role.SUPERMAN,
        },
        {
            href: '/ticketing-system',
            label: 'Sistem Tiket',
            icon: TicketIcon,
            forRole: Role.SUPERMAN,
        },
    ],
}
