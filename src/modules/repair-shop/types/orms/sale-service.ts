import type Service from '@/modules/repair-shop/types/orms/service'

export default interface SaleServiceORM {
    id: number
    sale_uuid: string
    service_id: string
    rp: number
    state: Service
}
