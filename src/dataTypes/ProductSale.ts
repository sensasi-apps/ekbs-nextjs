import type { Ymd } from '@/types/DateString'
import type { UUID } from 'crypto'
import type ActivityLogType from './ActivityLog'
import type BusinessUnitProductSale from './BusinessUnitProductSale'
import type InstallmentType from './Installment'
import type ProductMovementType from './ProductMovement'
import type ProductMovementDetail from './ProductMovementDetail'
import type TransactionType from './Transaction'
import type UserType from './User'

type ProductSaleType =
    | ProductSaleCashType
    | ProductSaleInstallmentType
    | ProductSaleWalletType

export default ProductSaleType

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
    refund_from_product_sale: ProductSaleType | null
    refund_product_sale: ProductSaleType | null

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
