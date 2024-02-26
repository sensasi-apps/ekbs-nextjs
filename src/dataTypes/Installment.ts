import type { CashableClassname } from './Transaction'
import type { UUID } from 'crypto'
import type { Ymd } from '@/types/DateString'
import type ProductSale from './ProductSale'
import type RentItemRent from './RentItemRent'
import type TransactionType from './Transaction'
import type UserLoan from './Loan'

type InstallmentDBTableType = {
    uuid: UUID
    should_be_paid_at: Ymd
    amount_rp: number
    penalty_rp: number
    n_th: number

    transaction?: TransactionType

    // table columns but practically unused
    // installmentable_uuid: UUID
} & (
    | {
          installmentable_classname: 'App\\Models\\UserLoan'
          installmentable?: UserLoan
          user_loan?: UserLoan
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
    user_loan: UserLoan
}

export type InstallmentWithTransactionType = InstallmentDBTableType & {
    transaction?: TransactionType
    transaction_cashable_classname?: CashableClassname
}

type Installment = InstallmentDBTableType | InstallmentUserLoan

export default Installment
