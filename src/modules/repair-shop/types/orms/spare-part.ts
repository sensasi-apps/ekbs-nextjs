import type { VehicleType } from '../../constants/vehicle-types'
import type SparePartWarehouseORM from './spare-part-warehouse'

export default interface SparePartORM {
    readonly id: number // [💾]
    code: string // [💾]
    name: string // [💾]
    unit: string // [💾]
    note: string // [💾]
    category: string // [💾]

    vehicle_type: VehicleType

    created_at: string
    updated_at: string
    deleted_at: string

    // relations
    warehouses: SparePartWarehouseORM[]

    // accessor
    general_base_rp_per_unit: number
    total_qty: number
}
