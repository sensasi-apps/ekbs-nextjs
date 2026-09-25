import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import '@/test-utils/mock-setup'
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'
import SaleFormDialog from './sale-form-dialog'

test('can choose installment for an unpaid sale with no saved margins', () => {
    render(
        <SaleFormDialog
            formData={{
                at: '2026-09-25',
                installment_data: null,
                is_finished: false,
                services: [],
                spare_part_margins: [null],
                spare_parts: [
                    {
                        qty: 2,
                        rp_per_unit: 1000,
                        spare_part_state: {
                            warehouses: [
                                {
                                    base_rp_per_unit: 500,
                                    installment_margin_percent: 10,
                                },
                            ],
                        } as SparePart,
                        spare_part_warehouse_id: 7,
                    },
                ],
            }}
            handleClose={() => {}}
            status={{ isDisabled: false }}
        />,
    )

    fireEvent.click(
        screen.getByRole('checkbox', { hidden: true, name: 'Sudah Dibayar' }),
    )
    fireEvent.click(screen.getByText('Angsuran'))

    expect(
        screen.getByRole('textbox', { hidden: true, name: 'Marjin Angsuran' }),
    ).toHaveProperty('value', '10')
    expect(screen.getAllByText(/2\.100/).length).toBeGreaterThan(0)
}, 10000)
