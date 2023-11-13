import type { UUID } from 'crypto'
import type TransactionType from './Transaction'
import type { Ymd } from '@/types/DateString'

type InstallmentDBTableType = {
    uuid: UUID
    should_be_paid_at: Ymd
    amount_rp: number
    penalty_rp: number
    n_th: number
    // installmentable_classname: string
    // installmentable_uuid: UUID
}

export type InstallmentWithRelationType = InstallmentDBTableType & {
    transaction?: TransactionType
}

type InstallmentType = InstallmentDBTableType | InstallmentWithRelationType

export default InstallmentType
