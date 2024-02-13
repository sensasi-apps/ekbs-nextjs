import BiotechIcon from '@mui/icons-material/Biotech'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import GroupIcon from '@mui/icons-material/Group'
import Role from '@/enums/Role'
import GroupTitle from './GroupTitle'
import NavItem from './NavItem.type'

const supermanNavItems: NavItem[] = [
    {
        children: <GroupTitle>Superman</GroupTitle>,
        forRole: Role.SUPERMAN,
    },
    {
        href: `${process.env.NEXT_PUBLIC_BACKEND_URL}/_/telescope`,
        label: 'Telescope',
        pathname: '/_/telescope',
        icon: <BiotechIcon />,
        forRole: Role.SUPERMAN,
    },
    {
        href: '/roles',
        label: 'Peran',
        pathname: '/roles',
        icon: <SupervisedUserCircleIcon />,
        forRole: Role.SUPERMAN,
    },
    {
        href: '/acting-as',
        label: 'Acting As',
        pathname: '/acting-as',
        icon: <GroupIcon />,
        forRole: Role.SUPERMAN,
    },
]

export default supermanNavItems
