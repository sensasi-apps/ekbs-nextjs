// types

// icons-materials
import Biotech from '@mui/icons-material/Biotech'
import Group from '@mui/icons-material/Group'
import TicketIcon from '@mui/icons-material/LocalActivity'
import Note from '@mui/icons-material/Note'
import OnlinePrediction from '@mui/icons-material/OnlinePrediction'
import PrintIcon from '@mui/icons-material/Print'
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle'
// enums
import Role from '@/enums/role'
import type NavItemGroup from '../types/nav-item-group'

export const supermans: NavItemGroup = {
    items: [
        {
            forRole: Role.SUPERMAN,
            href: '/roles',
            icon: SupervisedUserCircle,
            label: 'Peran',
        },
        {
            forRole: Role.SUPERMAN,
            href: '/acting-as',
            icon: Group,
            label: 'Acting As',
        },
        {
            forRole: Role.SUPERMAN,
            href: '/logs',
            icon: Note,
            label: 'Logs',
        },
        {
            forRole: Role.SUPERMAN,
            href: '/test',
            icon: Biotech,
            label: 'Test',
        },
        {
            forRole: Role.SUPERMAN,
            href: '/ticketing-system',
            icon: TicketIcon,
            label: 'Sistem Tiket',
        },
        {
            forRole: Role.SUPERMAN,
            href: '/print-test',
            icon: PrintIcon,
            label: 'Test Cetak',
        },

        {
            forRole: Role.SUPERMAN,
            href: '/online-users',
            icon: OnlinePrediction,
            label: 'Pengguna Online',
        },
    ],
    label: 'Superman',
}
