// @ts-nocheck intentionally ignored

import PrintHandler from '@/components/print-handler'
import Receipt from '../../repair-shop/sales/_parts/components/receipt'

export default function Page() {
    return (
        <div>
            <h1>Print Test</h1>

            <PrintHandler>
                <Receipt
                    data={{
                        adjustment_rp: 0,
                        at: '2025-09-10',
                        created_at: '2025-10-01T19:46:22.000000Z',
                        created_by_user: {
                            id: 0,
                            is_active: false,
                            name: 'name 1',
                            nickname: null,
                            uuid: '12345678-1234-1234-1234-123456789012',
                        },
                        created_by_user_uuid:
                            '12345678-1234-1234-1234-123456789012',
                        customer: {
                            id: 0,
                            is_active: true,
                            name: 'name 2',
                            nickname: null,
                            uuid: '12345678-1234-1234-1234-123456789012',
                        },
                        customer_uuid: '12345678-1234-1234-1234-123456789012',
                        final_rp: 63000,
                        finished_at: '2025-10-24',
                        installment_parent: null,
                        note: 'note',
                        payment_method: 'cash',
                        sale_services: [],
                        spare_part_margins: [],
                        spare_part_movement: {
                            at: '2025-09-10',
                            created_at: '2025-10-01T19:46:22.000000Z',
                            created_by_user_uuid:
                                '12345678-1234-1234-1234-123456789012',
                            details: [
                                {
                                    cost_rp_per_unit: 0,
                                    id: 8040,
                                    qty: -1,
                                    rp_per_unit: 63000,
                                    spare_part_id: 358,
                                    spare_part_movement_uuid:
                                        '12345678-1234-1234-1234-123456789012',
                                    spare_part_state: {
                                        code: '12345678-1234-1234-1234-123456789012',
                                        created_at:
                                            '2025-04-29T19:44:26.000000Z',
                                        deleted_at: null,
                                        id: 0,
                                        name: 'Item 1',
                                        note: '',
                                        unit: 'PCS',
                                        updated_at:
                                            '2025-04-29T19:44:26.000000Z',
                                        vehicle_type: 'motorcycle',
                                        warehouses: [
                                            {
                                                base_rp_per_unit: 52368.2805,
                                                default_sell_price: 62842,
                                                id: 0,
                                                installment_margin_percent: 10,
                                                low_number: null,
                                                margin_percent: 20,
                                                qty: 36,
                                                spare_part_id: 358,
                                                warehouse: 'main',
                                            },
                                        ],
                                    },
                                    spare_part_warehouse_id: 0,
                                },
                            ],
                            finalized_at: '2025-10-02 03:46:22',
                            note: 'Penjualan BELAYAN SPARE PARTS (kode: 1234567)',
                            sum_cost_rp: 0,
                            sum_value_rp: -63000,
                            type: 'sale',
                            updated_at: '2025-10-01T19:46:22.000000Z',
                            uuid: '12345678-1234-1234-1234-123456789012',
                            warehouse: 'main',
                        },
                        spare_part_movement_return: null,
                        spare_part_movement_uuid:
                            '12345678-1234-1234-1234-123456789012',
                        updated_at: '2025-10-24T05:01:50.000000Z',
                        uuid: '12345678-1234-1234-1234-123456789012',
                        worker_user_uuid: null,
                    }}
                />
            </PrintHandler>
        </div>
    )
}
