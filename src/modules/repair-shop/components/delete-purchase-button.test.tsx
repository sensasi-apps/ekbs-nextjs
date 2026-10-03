import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import DeletePurchaseButton from './delete-purchase-button'

const mocks = vi.hoisted(() => ({
    hasRole: vi.fn(() => true),
    mutate: vi.fn(() => Promise.resolve()),
    remove: vi.fn(),
}))
vi.mock('@/hooks/use-is-auth-has-role', () => ({
    default: () => mocks.hasRole,
}))
vi.mock('@/lib/axios', () => ({ default: { delete: mocks.remove } }))
vi.mock('swr', () => ({ useSWRConfig: () => ({ mutate: mocks.mutate }) }))
afterEach(cleanup)
beforeEach(() => {
    vi.clearAllMocks()
    mocks.hasRole.mockReturnValue(true)
    mocks.remove.mockResolvedValue({ status: 202 })
})
const uuid = '019a1234-1234-7123-8123-123456abcdef'

test('hides purchase deletion from non-superman users', () => {
    mocks.hasRole.mockReturnValue(false)
    render(
        <DeletePurchaseButton
            disabled={false}
            onDeleted={vi.fn()}
            purchaseUuid={uuid}
        />,
    )
    expect(screen.queryByRole('button', { name: 'Hapus Permanen' })).toBeNull()
})

test('requires the purchase code and reason and calls the purchase deletion endpoint', async () => {
    const onDeleted = vi.fn()
    render(
        <DeletePurchaseButton
            disabled={false}
            onDeleted={onDeleted}
            purchaseUuid={uuid}
        />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus Permanen' }))
    const confirm = screen.getByRole('button', { name: 'Yakin' })
    expect(confirm).toHaveProperty('disabled', true)
    fireEvent.change(screen.getByLabelText('Kode pembelian'), {
        target: { value: '6ABCDEF' },
    })
    expect(confirm).toHaveProperty('disabled', true)
    fireEvent.change(screen.getByLabelText('Alasan penghapusan'), {
        target: { value: 'Duplikat' },
    })
    fireEvent.click(confirm)
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
    expect(mocks.remove).toHaveBeenCalledWith(
        `repair-shop/spare-parts/purchases/${uuid}/permanent`,
        { data: { reason: 'Duplikat' } },
    )
    expect(mocks.mutate).toHaveBeenCalledOnce()
})

test('prevents purchase deletion while saving', () => {
    render(
        <DeletePurchaseButton
            disabled
            onDeleted={vi.fn()}
            purchaseUuid={uuid}
        />,
    )
    expect(
        screen.getByRole('button', { name: 'Hapus Permanen' }),
    ).toHaveProperty('disabled', true)
})

test('shows negative-stock validation without closing and recovers on a retry 404', async () => {
    const onDeleted = vi.fn()
    mocks.remove.mockRejectedValueOnce({
        response: {
            data: {
                errors: {
                    purchase: ['Penghapusan akan menyebabkan stok negatif.'],
                },
            },
            status: 422,
        },
    })
    render(
        <DeletePurchaseButton
            disabled={false}
            onDeleted={onDeleted}
            purchaseUuid={uuid}
        />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus Permanen' }))
    fireEvent.change(screen.getByLabelText('Kode pembelian'), {
        target: { value: '6ABCDEF' },
    })
    fireEvent.change(screen.getByLabelText('Alasan penghapusan'), {
        target: { value: 'Duplikat' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Yakin' }))
    await screen.findByText('Penghapusan akan menyebabkan stok negatif.')
    expect(onDeleted).not.toHaveBeenCalled()
    mocks.remove.mockRejectedValueOnce({ response: { status: 404 } })
    fireEvent.click(screen.getByRole('button', { name: 'Yakin' }))
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
})
