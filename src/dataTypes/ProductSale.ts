import type { Ymd } from '@/types/DateString'
import type { UUID } from 'crypto'
import type ProductType from './Product'
import type UserType from './User'
import type ProductMovementType from './ProductMovement'
import type ProductMovementDetailType from './ProductMovementDetail'
import type TransactionType from './Transaction'
import type InstallmentType from './Installment'
import ActivityLogType from './ActivityLog'

type ProductSaleType =
    | ProductSaleCashType
    | ProductSaleInstallmentType
    | ProductSaleWalletType

export default ProductSaleType

type BaseType = {
    uuid: UUID
    at: Ymd
    note: string
    products_state: ProductType[]

    // getter
    total_rp: number

    // relations
    product_movement: ProductMovementType
    product_movement_details: ProductMovementDetailType[]
    user_activity_logs: ActivityLogType[]

    // cash
    transaction?: TransactionType
    adjustment_rp?: number

    // installment
    installments?: InstallmentType[]
    interest_percent?: number
    n_term?: number
    n_term_unit?: 'minggu' | 'bulan'
}

type ProductSaleCashType = BaseType & {
    payment_method: 'cash'
    buyer_user_uuid?: UUID
    buyer_user?: UserType
    adjustment_rp: number
    transaction: TransactionType
}

export type ProductSaleInstallmentType = BaseType & {
    payment_method: 'installment'
    buyer_user_uuid: UUID
    buyer_user: UserType
    installments: InstallmentType[]
    interest_percent: number
    n_term: number
    n_term_unit: 'minggu' | 'bulan'
}

type ProductSaleWalletType = BaseType & {
    payment_method: 'wallet'
    buyer_user_uuid: UUID
    buyer_user: UserType
    transaction: TransactionType
}
