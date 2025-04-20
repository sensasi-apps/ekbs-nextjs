import type { Installment } from '@/dataTypes/Installment'
import type { Transaction } from '@/dataTypes/Transaction'

export type Sale = {
    uuid: string
} & SalePayment

type SalePayment =
    | {
          payment_method: 'cash'
          transaction: Transaction
          installments?: never
      }
    | {
          payment_method: 'installment'
          transaction?: never
          installments: Installment[]
      }
