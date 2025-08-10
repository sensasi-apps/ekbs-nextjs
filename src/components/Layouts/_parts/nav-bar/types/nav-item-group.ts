import type Role from '@/enums/Role'
import type { ElementType } from 'react'

interface NavItem {
    href: string
    label: string
    pathname?: string | string[]
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

import type Cash from '@/enums/permissions/Cash'
import type Executive from '@/enums/permissions/Executive'
import type FarmInput from '@/enums/permissions/FarmInput'
import type Finance from '@/enums/permissions/Finance'
import type HeavyEquipmentRent from '@/enums/permissions/HeavyEquipmentRent'
import type Mart from '@/enums/permissions/Mart'
import type PalmBunch from '@/enums/permissions/PalmBunch'
import type Transaction from '@/enums/permissions/Transaction'
import type UserLoan from '@/enums/permissions/UserLoan'
import type Wallet from '@/enums/permissions/Wallet'
// repair-shop features
import type RepairShopPurchasePermission from '@/features/repair-shop--purchase/enums/permission'
import type RepairShopSalePermission from '@/features/repair-shop--sale/enums/permission'
import type RepairShopSparePartPermission from '@/features/repair-shop--spare-part/enums/permission'
import type RepairShopServicePermission from '@/features/repair-shop--service/enums/permission'

type Permission =
    | Cash
    | Executive
    | FarmInput
    | Finance
    | HeavyEquipmentRent
    | Mart
    | PalmBunch
    | RepairShopPurchasePermission
    | RepairShopSalePermission
    | RepairShopSparePartPermission
    | RepairShopServicePermission
    | Transaction
    | UserLoan
    | Wallet
