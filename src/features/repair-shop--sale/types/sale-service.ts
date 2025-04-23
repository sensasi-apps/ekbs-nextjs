import type Service from '@/features/repair-shop--service/types/service'

export default interface SaleService {
    id: number
    sale_uuid: string
    service_id: string
    rp: number
    state: Service
}
