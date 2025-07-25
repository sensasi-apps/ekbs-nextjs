import type { Installment } from '@/dataTypes/Installment'
import type { Transaction } from '@/dataTypes/Transaction'
import type SparePartMovement from '@/features/repair-shop/types/spare-part-movement'
import type SaleService from './sale-service'
import type User from '@/features/user/types/user'

export type Sale = {
    uuid: string
    at: string
    customer_uuid: string
    payment_method: 'cash' | 'business-unit' | 'installment'
    note: string

    created_by_user_uuid: string
    finished_at: string

    adjustment_rp: number
    final_rp: number

    // relations
    sale_services: SaleService[]
    sale_spare_part_movement: {
        spare_part_movement: SparePartMovement
    }
    created_by_user: User
    customer: User
} & SalePayment

type SalePayment =
    | {
          payment_method: 'cash' | 'business-unit'
          transaction: Transaction
          installments: never
          installment_parent: never
      }
    | {
          payment_method: 'installment'
          transaction?: never
          installments: Installment[]
          installment_parent: {
              id: number
              n_term: number
              term_unit: 'minggu' | 'bulan'
              interest_percent: number
          }
      }
