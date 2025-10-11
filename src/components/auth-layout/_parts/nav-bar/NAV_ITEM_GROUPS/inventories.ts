import FeaturedPlayList from '@mui/icons-material/FeaturedPlayList'
import type NavItemGroup from '../types/nav-item-group'

export const inventories: NavItemGroup = {
    items: [
        {
            href: '/inventories/items',
            icon: FeaturedPlayList,
            label: 'Barang',
        },
    ],
    label: 'Inventaris',
}
