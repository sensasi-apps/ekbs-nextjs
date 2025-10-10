import type { Sale } from './sale'
import type SparePartWarehouseORM from './spare-part-warehouse'

export default interface SaleSparePartInstallmentMargin {
    /**
     * [💾]
     */
    readonly id: number

    /**
     * [💾]
     */
    readonly sale_uuid: Sale['uuid']

    /**
     * [💾]
     */
    readonly spare_part_warehouse_id: SparePartWarehouseORM['id']

    /**
     * [💾]
     */
    readonly margin_percentage: number

    /**
     * [💾]
     */
    readonly margin_rp: number
}
