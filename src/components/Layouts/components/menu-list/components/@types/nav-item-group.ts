import type Role from '@/enums/Role'
import type { Permission } from '@/@types/permission'
import type { SvgIconComponent } from '@mui/icons-material'

interface NavItem {
    href: string
    label: string
    pathname?: string | string[]
    icon: SvgIconComponent
    forRole?: Role | Role[]
    forPermission?: Permission | Permission[]
}

export interface NavItemGroup {
    label?: string
    items: NavItem[]
}
