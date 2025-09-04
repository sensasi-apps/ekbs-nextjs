import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type { ProductSale } from '@/dataTypes/ProductSale'
import type RentItemRent from '@/types/orms/rent-item-rent'
import type { Transaction } from '@/dataTypes/Transaction'
import type { UserLoanType } from '@/dataTypes/Loan'

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
    installmentable?: UserLoanType | ProductSale | RentItemRent
    user_loan?: UserLoanType
    product_sale?: ProductSale
    rent_item_rent?: RentItemRent
}
