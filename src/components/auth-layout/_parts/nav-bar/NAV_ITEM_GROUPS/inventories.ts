import type NavItemGroup from '../types/nav-item-group'
import FeaturedPlayList from '@mui/icons-material/FeaturedPlayList'

export const inventories: NavItemGroup = {
    label: 'Inventaris',
    items: [
        {
            href: '/inventories/items',
            label: 'Barang',
            icon: FeaturedPlayList,
        },
    ],
}
