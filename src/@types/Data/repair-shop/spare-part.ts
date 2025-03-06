import type VehicleType from '@/enums/db-columns/repair-shop/spare-part/vehicle-type'

export default interface SparePart {
    id: number
    code: string
    name: string
    unit: string
    note: string

    vehicle_type: VehicleType.CAR | VehicleType.MOTORCYCLE
    low_number: number | null
    margin_percent: number

    created_at: string
    updated_at: string
    deleted_at: string

    // relations
    warehouses: SparePartWarehouse[]

    // accessor
    low_number_final: number
    margin_percent_final: number
    general_base_rp_per_unit: number
    total_qty: number
}

interface SparePartWarehouse {
    id: number
    spare_part_id: number
    warehouse: string
    qty: number
    base_rp_per_unit: number
    low_number: number | null
    margin_percent: number | null
}
