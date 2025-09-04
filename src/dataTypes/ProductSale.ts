import type { Ymd } from '@/types/date-string'
import type { UUID } from 'crypto'
import type ActivityLogType from '../types/orms/activity-log'
import type BusinessUnitProductSale from '../types/orms/business-unit-product-sale'
import type { Installment } from './Installment'
import type ProductMovementType from '../types/orms/product-movement'
import type ProductMovementDetail from '../types/orms/product-movement-detail'
import type { Transaction } from './Transaction'
import type UserType from '../modules/auth/types/orms/user'

export type ProductSale =
    | ProductSaleCashType
    | ProductSaleInstallmentType
    | ProductSaleWalletType

type BaseType = {
    uuid: UUID
    short_uuid: string
    at: Ymd
    note: string

    // getter
    is_paid: boolean
    total_rp: number
    total_base_rp: number
    payment_method_id:
        | 'Tunai'
        | 'Potong TBS (1x)'
        | 'Potong TBS (2x)'
        | 'Saldo Unit Bisnis'
        | 'EKBS Wallet'

    // relations
    product_movement: ProductMovementType
    product_movement_details: ProductMovementDetail[]
    user_activity_logs: ActivityLogType[]
    business_unit_product_sale: BusinessUnitProductSale | null
    refund_from_product_sale: ProductSale | null
    refund_product_sale: ProductSale | null

    // cash
    transaction?: Transaction
    adjustment_rp?: number

    // installment
    installments?: Installment[]
    interest_percent?: number
    n_term?: number
    n_term_unit?: 'minggu' | 'bulan'
}

type ProductSaleCashType = BaseType & {
    payment_method: 'cash'
    buyer_user_uuid?: UUID
    buyer_user?: UserType
    adjustment_rp: number
    transaction: Transaction
}

export type ProductSaleInstallmentType = BaseType & {
    payment_method: 'installment'
    buyer_user_uuid: UUID
    buyer_user: UserType
    installments: Installment[]
    interest_percent: number
    n_term: number
    n_term_unit: 'minggu' | 'bulan'
}

type ProductSaleWalletType = BaseType & {
    payment_method: 'wallet'
    buyer_user_uuid: UUID
    buyer_user: UserType
    transaction: Transaction
}
