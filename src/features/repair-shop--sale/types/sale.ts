import type { Installment } from '@/dataTypes/Installment'
import type { Transaction } from '@/dataTypes/Transaction'
import type SparePartMovement from '@/features/repair-shop/types/spare-part-movement'
import type SaleService from './sale-service'

export type Sale = {
    uuid: string
    at: string
    customer_uuid: string
    payment_method: 'cash' | 'business-unit' | 'installment'
    note: string

    created_by_user_uuid: string
    finished_at: string
    total_rp: number

    sale_services: SaleService[]
    sale_spare_part_movement: {
        spare_part_movement: SparePartMovement
    }
} & SalePayment

type SalePayment =
    | {
          payment_method: 'cash' | 'business-unit'
          transaction: Transaction
          installments?: never
      }
    | {
          payment_method: 'installment'
          transaction?: never
          installments: Installment[]
      }
