import type InstallmentORM from '@/modules/installment/types/orms/installment'
import type SaleService from '@/modules/repair-shop/types/orms/sale-service'
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type User from '@/modules/user/types/orms/user'
import type HasUuidPk from '@/types/has-uuid-pk'
import type SaleSparePartInstallmentMargin from './sale_spare_part_installment_margin'

/**
 * [Sale Eloquent Model](https://github.com/sensasi-apps/ekbs-laravel/blob/main/Modules/RepairShop/app/Models/Sale.php)
 */
export type Sale = HasUuidPk & {
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

    /** [💾] */
    spare_part_movement_uuid?: SparePartMovement['uuid']

    /** [💾] */
    spare_part_movement_return_uuid?: SparePartMovement['uuid']

    /** [🔗] */
    readonly sale_services?: SaleService[]

    /** [🔗] */
    readonly spare_part_movement?: SparePartMovement

    /** [🔗] */
    readonly spare_part_movement_return?: SparePartMovement

    /** [🔗] */
    readonly spare_part_margins?: SaleSparePartInstallmentMargin[]

    /** [🔗] */
    readonly created_by_user?: User

    /** [🔗] */
    readonly customer?: User
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
