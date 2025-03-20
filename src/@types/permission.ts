import type Cash from '@/enums/permissions/Cash'
import type Executive from '@/enums/permissions/Executive'
import type FarmInput from '@/enums/permissions/FarmInput'
import type Finance from '@/enums/permissions/Finance'
import type HeavyEquipmentRent from '@/enums/permissions/HeavyEquipmentRent'
import type Mart from '@/enums/permissions/Mart'
import type PalmBunch from '@/enums/permissions/PalmBunch'
import type SparePartPermission from '@/features/repair-shop--spare-part/enums/permission'
import type ServicePermission from '@/features/repair-shop--service/enums/permission'
import type Transaction from '@/enums/permissions/Transaction'
import type UserLoan from '@/enums/permissions/UserLoan'
import type Wallet from '@/enums/permissions/Wallet'

export type Permission =
    | Cash
    | Executive
    | FarmInput
    | Finance
    | HeavyEquipmentRent
    | Mart
    | PalmBunch
    | SparePartPermission
    | ServicePermission
    | Transaction
    | UserLoan
    | Wallet
