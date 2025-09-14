import type Service from '@/app/(auth)/repair-shop/services/_parts/types/service'
import type SparePart from '@/app/(auth)/repair-shop/spare-parts/_types/spare-part-model'

export default interface SaleFormValues {
    uuid?: string
    at?: string
    note?: string

    is_finished?: boolean

    payment_method?: 'cash' | 'business-unit' | 'installment'

    // cash
    adjustment_rp?: number
    cash_uuid?: string
    costumer_uuid?: string

    // installment
    installment_data: {
        n_term: number
        term_unit?: 'minggu' | 'bulan'
    }

    // business unit
    business_unit_cash_uuid?: string

    spare_parts: Partial<{
        spare_part_state?: SparePart // if defined, it's an existing sale
        spare_part_warehouse_id: number
        qty: number
        rp_per_unit: number
    }>[]

    spare_part_margins: {
        spare_part_warehouse_id: number
        margin_percentage: number
    }[]

    services: Partial<{
        state?: Service // if defined, it's an existing sale
        service_id: string
        rp: number
    }>[]
}
