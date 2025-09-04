import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type SparePartORM from '@/app/(auth)/repair-shop/spare-parts/_types/spare-part-model'

export default interface SparePartMovementORM {
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

    state: SparePartORM

    // relations
    transaction?: TransactionORM
    details: Detail[]
    costs: []
}

interface Detail {
    id: number

    spare_part_movement_uuid: SparePartMovementORM['uuid']

    /**
     * relation
     */
    spare_part_movement?: SparePartMovementORM

    spare_part_id: SparePartORM['id']
    spare_part: SparePartORM

    qty: number
    rp_per_unit: number
    cost_rp_per_unit: number

    spare_part_state: SparePartORM | null
}
