import type SparePartORM from './spare-part'

export default interface SparePartWarehouseORM {
    /**
     * [💾]
     */
    readonly id: number

    /**
     * [💾]
     */
    readonly spare_part_id: SparePartORM['id']

    /**
     * [💾]
     */
    readonly warehouse: 'main'

    /**
     * [💾]
     */
    readonly qty: number

    /**
     * [💾]
     */
    readonly base_rp_per_unit: number

    /**
     * [💾]
     */
    readonly low_number: number | null

    /**
     * [💾]
     */
    readonly margin_percent: number

    /**
     * [💾]
     */
    readonly installment_margin_percent: number

    /**
     * [🤌🏻]
     */
    readonly default_sell_price: number
}
