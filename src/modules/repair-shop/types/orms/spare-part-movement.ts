import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type SparePartORM from '@/modules/repair-shop/types/orms/spare-part'

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

/**
 * @see [ProductMovementDetail Eloquent](https://github.com/sensasi-apps/ekbs-laravel/blob/main/Modules/RepairShop/app/Models/SparePartMovementDetail.php)
 */
interface Detail {
    /**
     * [💾]
     *
     *  @readonly
     */
    id: number

    /**
     * [💾]
     *
     *  @readonly
     */
    spare_part_movement_uuid: SparePartMovementORM['uuid']

    /**
     * [💾]
     */
    spare_part_id: SparePartORM['id']

    /**
     * [💾]
     */
    qty: number

    /**
     * [💾]
     */
    rp_per_unit: number

    /**
     * [💾]
     */
    cost_rp_per_unit: number

    /**
     * [💾]
     */
    spare_part_state: SparePartORM | null

    /**
     * [💾]
     */
    spare_part_warehouse_id: number

    /**
     * [🔗]
     */
    spare_part_movement?: SparePartMovementORM

    /**
     * [🔗]
     */
    spare_part: SparePartORM
}
