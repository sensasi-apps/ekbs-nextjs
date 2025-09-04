import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import type RentItemRent from '@/types/orms/rent-item-rent'
import type { Transaction } from '@/dataTypes/Transaction'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'

export default interface InstallmentORM {
    uuid: UUID
    should_be_paid_at: Ymd
    amount_rp: number
    penalty_rp: number
    n_th: number
    state: string
    installmentable_uuid: UUID

    // relation
    transaction?: Transaction
    installmentable_classname:
        | 'App\\Models\\UserLoan'
        | 'App\\Models\\ProductSale'
        | 'App\\Models\\RentItemRent'
    installmentable?: UserLoanORM | ProductSaleORM | RentItemRent
    user_loan?: UserLoanORM
    product_sale?: ProductSaleORM
    rent_item_rent?: RentItemRent
}
