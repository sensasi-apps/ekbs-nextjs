import type NavItemGroup from '../types/nav-item-group'
import FeaturedPlayList from '@mui/icons-material/FeaturedPlayList'

export const inventories: NavItemGroup = {
    label: 'Inventaris',
    items: [
        {
            href: '/inventory-items',
            label: 'Barang',
            pathname: ['/inventory-items', '/inventory-items/[uuid]'],
            icon: FeaturedPlayList,
        },
    ],
}
