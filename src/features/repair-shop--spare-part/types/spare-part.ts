import type VehicleType from '../enums/vehicle-type'

export default interface SparePart {
    id: number
    code: string
    name: string
    unit: string
    note: string

    vehicle_type: VehicleType.CAR | VehicleType.MOTORCYCLE

    created_at: string
    updated_at: string
    deleted_at: string

    // relations
    warehouses: SparePartWarehouse[]

    // accessor
    general_base_rp_per_unit: number
    total_qty: number
}

interface SparePartWarehouse {
    id: number
    spare_part_id: number
    warehouse: string
    qty: number
    base_rp_per_unit: number
    default_sell_price: number
    low_number: number | null
    margin_percent: number
    installment_margin_percent: number
}
