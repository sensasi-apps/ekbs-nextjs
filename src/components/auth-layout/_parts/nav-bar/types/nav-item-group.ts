import type Role from '@/enums/Role'
import type { Permission } from '@/types/permission'
import type { ElementType } from 'react'

interface NavItem {
    href: string
    label: string

    /**
     * @deprecated use `routeAliases` instead.
     */
    pathname?: string | string[]

    routeAliases?: string[]

    icon: ElementType

    /**
     * `undefined` value for `forRole` means all roles.
     *
     * set it to `[]` if you want to hide the item / only for superman.
     */
    forRole?: Role | Role[]

    /**
     * `undefined` value for `forPermission` means all permissions.
     *
     * set it to `[]` if you want to hide the item / only for superman.
     */
    forPermission?: Permission | Permission[]
}

export default interface NavItemGroup {
    label?: string
    items: NavItem[]
}
