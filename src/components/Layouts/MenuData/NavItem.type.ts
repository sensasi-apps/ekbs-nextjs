import Role from '@/enums/Role'

type NavItemComponent = {
    href?: never
    label?: never
    pathname?: never
    icon?: never

    children: JSX.Element
    forRole?: Role | Role[]
    forPermission?: string | string[]
}

type NavItemLink = {
    children?: never

    href: string
    label: string
    pathname?: string | string[]
    icon: JSX.Element
    forRole?: Role | Role[]
    forPermission?: string | string[]
}

type NavItem = NavItemComponent | NavItemLink

export default NavItem
