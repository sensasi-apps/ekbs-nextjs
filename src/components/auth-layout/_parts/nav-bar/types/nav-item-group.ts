import type { Route } from 'next'
import type { ElementType } from 'react'
import type Role from '@/enums/role'
import type { Permission } from '@/types/permission'

interface NavItem {
    href: Route
    label: string
    icon: ElementType

    /**
     * `undefined` value for this props means  allow for all roles.
     *
     * set it to `[]` if you want to hide the item / only for superman.
     *
     * @deprecated use `forPermission` instead.
     */
    forRole?: Role | Role[]

    /**
     * `undefined` value for this props means allow for all permissions.
     *
     * set it to `[]` if you want to hide the item / only for superman.
     */
    forPermission?: Permission | Permission[]
}

export default interface NavItemGroup {
    label: string
    items: NavItem[]
}
