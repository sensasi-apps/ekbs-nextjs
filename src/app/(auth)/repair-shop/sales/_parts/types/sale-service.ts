import type Service from '@/app/(auth)/repair-shop/services/_parts/types/service'

export default interface SaleService {
    id: number
    sale_uuid: string
    service_id: string
    rp: number
    state: Service
}
