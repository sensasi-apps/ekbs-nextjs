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
import type Clm from '@/modules/clm/enums/permission'
// modules
import type RepairShop from '@/modules/repair-shop/enums/permission'

export type Permission =
    | Cash
    | Executive
    | FarmInput
    | Finance
    | HeavyEquipmentRent
    | Mart
    | PalmBunch
    | RepairShop
    | Transaction
    | UserLoan
    | Wallet
    | Clm
    // HOTFIX, SHOULD MAKE IT IS OWN ENUM
    | 'create inventory item'
    | 'update inventory item'
    | 'inventory item update'
    | 'delete own loan'
