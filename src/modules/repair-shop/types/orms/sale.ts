import type InstallmentORM from '@/modules/installment/types/orms/installment'
import type SaleService from '@/modules/repair-shop/types/orms/sale-service'
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type User from '@/modules/user/types/orms/user'
import type SaleSparePartInstallmentMargin from './sale_spare_part_installment_margin'

export type Sale = {
    /** [💾] */
    readonly uuid: string

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

    /** [🤌🏻] */
    readonly short_uuid: string

    /** [🔗] */
    sale_services?: SaleService[]

    /** [🔗] */
    spare_part_movement?: SparePartMovement

    /** [🔗] */
    spare_part_margins?: SaleSparePartInstallmentMargin[]

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
