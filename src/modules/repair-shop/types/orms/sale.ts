import type InstallmentORM from '@/modules/installment/types/orms/installment'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
import type SaleService from '@/modules/repair-shop/types/orms/sale-service'
import type User from '@/modules/user/types/orms/user'

export type Sale = {
    /** [💾] */
    uuid: string

    /** [💾] */
    at: string

    /** [💾] */
    customer_uuid: string

    /** [💾] */
    payment_method: 'cash' | 'business-unit' | 'installment'

    /** [💾] */
    note: string

    /** [💾] */
    created_by_user_uuid: string

    /** [💾] */
    finished_at: string

    /** [💾] */
    adjustment_rp: number

    /** [💾] */
    final_rp: number

    /** [💾] */
    created_at: string

    /** [💾] */
    updated_at: string

    /** [💾] */
    worker_user_uuid: string

    /** [🔗] */
    sale_services?: SaleService[]

    /** [🔗] */
    spare_part_movement?: SparePartMovement

    /** [🔗] */
    spare_part_margins?: {
        spare_part_warehouse_id: number
        margin_percentage: number
        margin_rp: number
    }[]

    /** [🔗] */
    created_by_user?: User

    /** [🔗] */
    customer?: User
} & SalePayment

type SalePayment =
    | {
          payment_method: 'cash' | 'business-unit'
          transaction: TransactionORM
          installments: never
          installment_parent: never
      }
    | {
          payment_method: 'installment'
          transaction?: never
          installments: InstallmentORM[]
          installment_parent?: {
              id: number
              n_term: number
              term_unit: 'minggu' | 'bulan'
              interest_percent: number
          }
      }
