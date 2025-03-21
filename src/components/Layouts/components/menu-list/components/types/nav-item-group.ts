import type Role from '@/enums/Role'
import type { Permission } from '@/components/Layouts/components/menu-list/components/types/permission'
import type { ElementType } from 'react'

interface NavItem {
    href: string
    label: string
    pathname?: string | string[]
    icon: ElementType
    forRole?: Role | Role[]
    forPermission?: Permission | Permission[]
}

export default interface NavItemGroup {
    label?: string
    items: NavItem[]
}
