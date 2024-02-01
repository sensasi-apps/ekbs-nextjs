import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList'
import GroupTitle from './GroupTitle'
import NavItem from './NavItem.type'

const inventoryNavItems: NavItem[] = [
    {
        children: <GroupTitle>Inventaris</GroupTitle>,
    },
    {
        href: '/inventory-items',
        label: 'Barang',
        pathname: ['/inventory-items', '/inventory-items/[uuid]'],
        icon: <FeaturedPlayListIcon />,
    },
]

export default inventoryNavItems
