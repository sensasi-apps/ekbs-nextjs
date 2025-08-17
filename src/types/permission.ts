import type Cash from '@/enums/permissions/Cash'
import type Executive from '@/enums/permissions/Executive'
import type FarmInput from '@/enums/permissions/FarmInput'
import type Finance from '@/enums/permissions/Finance'
import type HeavyEquipmentRent from '@/enums/permissions/heavy-equipment-rent'
import type Mart from '@/enums/permissions/Mart'
import type PalmBunch from '@/enums/permissions/PalmBunch'
import type Transaction from '@/enums/permissions/Transaction'
import type UserLoan from '@/enums/permissions/UserLoan'
import type Wallet from '@/enums/permissions/Wallet'
// repair-shop features
import type RepairShopPurchasePermission from '@/app/(auth)/repair-shop/spare-part-purchases/_parts/enums/permission'
import type RepairShopSalePermission from '@/app/(auth)/repair-shop/sales/_parts/enums/permission'
import type RepairShopSparePartPermission from '@/app/(auth)/repair-shop/spare-parts/_enums/permission'
import type RepairShopServicePermission from '@/app/(auth)/repair-shop/services/_parts/enums/permission'

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
