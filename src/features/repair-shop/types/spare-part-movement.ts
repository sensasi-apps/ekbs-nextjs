import type { Transaction } from '@/dataTypes/Transaction'
import type SparePart from '@/features/repair-shop--spare-part/types/spare-part'

export default interface SparePartMovement {
    uuid: string
    at: string
    finalized_at: string | null
    type: 'purchase' | 'sale' | 'return' | 'opname'
    warehouse: 'main'
    payment_method: 'cash' | 'credit'
    note: string | null
    sum_value_rp: number
    sum_cost_rp: number

    created_at: string
    updated_at: string

    state: SparePart

    // relations
    transaction?: Transaction
    details: Detail[]
    costs: []
}

interface Detail {
    id: number

    spare_part_movement_uuid: SparePartMovement['uuid']

    /**
     * relation
     */
    spare_part_movement?: SparePartMovement

    spare_part_id: SparePart['id']
    spare_part: SparePart

    qty: number
    rp_per_unit: number
    cost_rp_per_unit: number

    spare_part_state: SparePart | null
}
