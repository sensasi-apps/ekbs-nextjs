import type { Ymd } from '@/types/date-string'
import type { UUID } from 'crypto'
import type ActivityLogORM from '@/types/orms/activity-log'
import type BusinessUnitProductSaleORM from '@/types/orms/business-unit-product-sale'
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import type ProductMovementORM from '@/modules/farm-inputs/types/orms/product-movement'
import type ProductMovementDetailORM from '@/modules/farm-inputs/types/orms/product-movement-detail'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type UserORM from '@/modules/user/types/orms/user'

export default interface ProductSaleORM {
    uuid: UUID
    short_uuid: string
    at: Ymd
    note: string

    // getter
    is_paid: boolean
    total_rp: number
    total_base_rp: number

    payment_method: 'installment' | 'wallet' | 'cash'
    payment_method_id:
        | 'Tunai'
        | 'Potong TBS (1x)'
        | 'Potong TBS (2x)'
        | 'Saldo Unit Bisnis'
        | 'EKBS Wallet'

    // relations
    product_movement: ProductMovementORM
    product_movement_details: ProductMovementDetailORM[]
    user_activity_logs: ActivityLogORM[]
    business_unit_product_sale: BusinessUnitProductSaleORM | null
    refund_from_product_sale: ProductSaleORM | null
    refund_product_sale: ProductSaleORM | null

    // cash
    transaction?: TransactionORM
    adjustment_rp?: number

    // installment
    installments?: InstallmentORM[]
    interest_percent?: number
    n_term?: number
    n_term_unit?: 'minggu' | 'bulan'

    buyer_user_uuid?: UUID
    buyer_user: UserORM
}
