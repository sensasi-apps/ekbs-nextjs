import type { CashableClassname } from './Transaction'
import type { UUID } from 'crypto'
import type { Ymd } from '@/types/date-string'
import type { ProductSale } from './ProductSale'
import type RentItemRent from '../types/orms/rent-item-rent'
import type { Transaction } from './Transaction'
import type { UserLoanType } from './Loan'

type InstallmentDBTableType = {
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
} & (
    | {
          installmentable_classname: 'App\\Models\\UserLoan'
          installmentable?: UserLoanType
          user_loan?: UserLoanType
      }
    | {
          installmentable_classname: 'App\\Models\\ProductSale'
          installmentable?: ProductSale
          product_sale?: ProductSale
      }
    | {
          installmentable_classname: 'App\\Models\\RentItemRent'
          installmentable?: RentItemRent
          rent_item_rent?: RentItemRent
      }
)

export type InstallmentUserLoan = InstallmentDBTableType & {
    user_loan: UserLoanType
}

export type InstallmentWithTransactionType = InstallmentDBTableType & {
    transaction?: Transaction
    transaction_cashable_classname?: CashableClassname
}

export type Installment = InstallmentDBTableType | InstallmentUserLoan
