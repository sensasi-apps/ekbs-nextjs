import type InstallmentORM from '@/modules/installment/types/orms/installment'

export default interface ApiResponseItem extends InstallmentORM {
    at: string
    user_id: number
    user_name: string
}
