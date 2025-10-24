import type { UUID } from 'node:crypto'
import type InstallmentTnstallmentableClassname from '@/enums/installment-installemtable-classname'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type MinimalUser from '@/modules/user/types/minimal-user'
import type { Ymd } from '@/types/date-string'
import type RentItemRent from '@/types/orms/rent-item-rent'

export default interface InstallmentORM {
    uuid: UUID
    should_be_paid_at: Ymd
    amount_rp: number
    penalty_rp: number
    n_th: number
    state: string
    installmentable_uuid: UUID

    // relation
    transaction?: TransactionORM
    installmentable_classname:
        | 'App\\Models\\UserLoan'
        | 'App\\Models\\ProductSale'
        | 'App\\Models\\RentItemRent'
        | 'Modules\\RepairShop\\Models\\Sale'
        | InstallmentTnstallmentableClassname
    installmentable?: UserLoanORM | ProductSaleORM | RentItemRent
    user_loan?: UserLoanORM
    product_sale?: ProductSaleORM
    rent_item_rent?: RentItemRent

    /**
     * [🤌🏻]
     */
    creditor?: MinimalUser
}
