import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import '@/test-utils/mock-setup'
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'
import SaleFormDialog from './sale-form-dialog'

const auth = vi.hoisted(() => ({
    current: undefined as { uuid: string; role_names: string[] } | undefined,
}))
vi.mock('@/hooks/use-auth-info', () => ({ default: () => auth.current }))
afterEach(cleanup)
beforeEach(() => {
    auth.current = undefined
    sessionStorage.clear()
})

test('superman can permanently delete a completed read-only sale', async () => {
    auth.current = { role_names: ['superman'], uuid: 'admin' }
    render(
        <SaleFormDialog
            formData={{
                is_finished: true,
                payment_method: 'cash',
                services: [],
                spare_parts: [],
                uuid: 'sale',
            }}
            handleClose={() => {}}
            status={{ isDisabled: true }}
        />,
    )
    expect(
        await screen.findByRole('button', {
            hidden: true,
            name: 'Hapus Permanen',
        }),
    ).toHaveProperty('disabled', false)
}, 10000)

test('an unresolved submission prevents permanent deletion in the actual sale dialog', async () => {
    auth.current = { role_names: ['superman'], uuid: 'admin' }
    const values = { services: [], spare_parts: [], uuid: 'sale' }
    sessionStorage.setItem(
        'repair-shop:sale-submission:admin:sale',
        JSON.stringify({
            expiresAt: Date.now() + 100000,
            key: 'pending',
            method: 'PUT',
            path: 'repair-shop/sales/sale',
            values,
        }),
    )
    render(
        <SaleFormDialog
            formData={values}
            handleClose={() => {}}
            status={{ isDisabled: false }}
        />,
    )
    expect(
        await screen.findByRole('button', {
            hidden: true,
            name: 'Hapus Permanen',
        }),
    ).toHaveProperty('disabled', true)
}, 10000)

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
