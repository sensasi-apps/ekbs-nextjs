import type Role from '@/enums/Role'
import type { Permission } from '@/@types/permission'
import type { ElementType } from 'react'

interface NavItem {
    href: string
    label: string
    pathname?: string | string[]
    icon: ElementType
    forRole?: Role | Role[]
    forPermission?: Permission | Permission[]
}

export interface NavItemGroup {
    label?: string
    items: NavItem[]
}
