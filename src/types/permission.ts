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

export type Permission =
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
    // HOTFIX, SHOULD MAKE IT IS OWN ENUM
    | 'create inventory item'
    | 'update inventory item'
    | 'inventory item update'
    | 'delete own loan'
