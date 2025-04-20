import type Service from '@/features/repair-shop--service/types/service'

export default interface SaleService {
    sale_uuid: string
    service_id: string
    rp: number
    state: Service
}
