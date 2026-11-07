import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import RefundHeGasSale from './refund'

const { post, canRefund } = vi.hoisted(() => ({
    canRefund: vi.fn(() => true),
    post: vi.fn(),
}))

vi.mock('@/lib/axios', () => ({ default: { post } }))
vi.mock('@/hooks/use-is-auth-has-permission', () => ({
    default: () => canRefund,
}))

const sale = {
    at: '2026-01-05',
    business_unit_product_sale: {
        inventory_item_checkup: {
            inventory_item: { code: 'HE-001', name: 'Excavator' },
        },
    },
    can_refund: true,
    product_movement_details: [
        { id: 1, product_state: { name: 'Solar', unit: 'liter' }, qty: -2 },
    ],
    short_uuid: '6789ABC',
    total_rp: 12000,
    uuid: '11111111-1111-4111-8111-123456789abc',
} as unknown as ProductSaleORM

beforeEach(() => {
    vi.clearAllMocks()
    canRefund.mockReturnValue(true)
})
afterEach(cleanup)

test('shows sale details and submits a trimmed reason before refreshing', async () => {
    post.mockResolvedValue({})
    const onRefund = vi.fn()
    render(<RefundHeGasSale onRefund={onRefund} sale={sale} />)

    fireEvent.click(screen.getByRole('button', { name: 'Refund' }))
    expect(screen.getByRole('dialog').textContent).toContain('Excavator')
    expect(screen.getByRole('dialog').textContent).toContain('Solar')
    fireEvent.change(screen.getByLabelText(/Alasan refund/), {
        target: { value: '  Salah input  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Refund penjualan' }))

    await waitFor(() => expect(onRefund).toHaveBeenCalledOnce())
    expect(post).toHaveBeenCalledWith(
        `farm-inputs/he-gas-sales/${sale.uuid}/refund`,
        { reason: 'Salah input' },
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
})

test('shows server validation errors and allows a retry', async () => {
    post.mockRejectedValue({
        response: {
            data: { errors: { error: ['Bulan penjualan sudah lewat.'] } },
            status: 422,
        },
    })
    render(<RefundHeGasSale onRefund={vi.fn()} sale={sale} />)
    fireEvent.click(screen.getByRole('button', { name: 'Refund' }))
    fireEvent.change(screen.getByLabelText(/Alasan refund/), {
        target: { value: 'Salah input' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Refund penjualan' }))

    await waitFor(() =>
        expect(screen.getByRole('alert').textContent).toContain(
            'Bulan penjualan sudah lewat.',
        ),
    )
    expect(
        screen
            .getByRole('button', { name: 'Refund penjualan' })
            .hasAttribute('disabled'),
    ).toBe(false)
})

test('disables repeat submission while the request is pending', async () => {
    let finish!: (value: object) => void
    post.mockImplementation(
        () =>
            new Promise(resolve => {
                finish = resolve
            }),
    )
    render(<RefundHeGasSale onRefund={vi.fn()} sale={sale} />)
    fireEvent.click(screen.getByRole('button', { name: 'Refund' }))
    fireEvent.change(screen.getByLabelText(/Alasan refund/), {
        target: { value: 'Salah input' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Refund penjualan' }))

    expect(
        screen
            .getByRole('button', { name: 'Refund penjualan' })
            .hasAttribute('disabled'),
    ).toBe(true)
    expect(post).toHaveBeenCalledOnce()
    finish({})
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
})

test('does not offer refunds outside the current sale month', () => {
    render(
        <RefundHeGasSale
            onRefund={vi.fn()}
            sale={{ ...sale, can_refund: false }}
        />,
    )
    expect(screen.queryByRole('button', { name: 'Refund' })).toBeNull()
})

test('does not offer refunds without permission', () => {
    canRefund.mockReturnValue(false)
    render(<RefundHeGasSale onRefund={vi.fn()} sale={sale} />)
    expect(screen.queryByRole('button', { name: 'Refund' })).toBeNull()
})

test('shows refunded history as read-only', () => {
    render(
        <RefundHeGasSale
            onRefund={vi.fn()}
            sale={{
                ...sale,
                refund_product_sale: {
                    ...sale,
                    created_at: '2026-01-20T00:00:00Z',
                    note: 'Salah unit',
                    user_activity_logs: [],
                },
            }}
        />,
    )
    expect(screen.getByText('Sudah direfund')).toBeTruthy()
    expect(screen.getByText('Salah unit')).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
})
