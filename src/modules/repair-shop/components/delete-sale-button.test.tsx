import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import DeleteSaleButton from './delete-sale-button'

const mocks = vi.hoisted(() => ({
    hasRole: vi.fn(() => true),
    mutate: vi.fn((_key: (key: unknown) => boolean) => Promise.resolve()),
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

test('allows one in-flight deletion and recovers an uncertain response by retrying', async () => {
    const onDeleted = vi.fn()
    const onDeletingChange = vi.fn()
    let rejectRequest: ((error: Error) => void) | undefined
    mocks.remove.mockImplementationOnce(
        () =>
            new Promise((_resolve, reject) => {
                rejectRequest = reject
            }),
    )
    render(
        <DeleteSaleButton
            disabled={false}
            onDeleted={onDeleted}
            onDeletingChange={onDeletingChange}
            saleUuid={uuid}
        />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus Permanen' }))
    fireEvent.change(screen.getByLabelText('Kode penjualan'), {
        target: { value: '6ABCDEF' },
    })
    fireEvent.change(screen.getByLabelText('Alasan penghapusan'), {
        target: { value: 'Duplikat' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Yakin' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yakin' }))
    expect(mocks.remove).toHaveBeenCalledOnce()
    expect(onDeletingChange).toHaveBeenCalledWith(true)
    rejectRequest?.(new Error('Network error'))
    await screen.findByText(
        'Hasil penghapusan belum dapat dipastikan. Periksa koneksi lalu coba lagi.',
    )
    expect(onDeleted).not.toHaveBeenCalled()
    expect(onDeletingChange).toHaveBeenLastCalledWith(false)
    mocks.remove.mockRejectedValueOnce({ response: { status: 404 } })
    fireEvent.click(screen.getByRole('button', { name: 'Yakin' }))
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
})

test('hides permanent deletion from non-superman users', () => {
    mocks.hasRole.mockReturnValue(false)
    render(
        <DeleteSaleButton
            disabled={false}
            onDeleted={vi.fn()}
            saleUuid={uuid}
        />,
    )
    expect(screen.queryByRole('button', { name: 'Hapus Permanen' })).toBeNull()
})

test('disables deletion while a sale submission is unresolved', () => {
    render(<DeleteSaleButton disabled onDeleted={vi.fn()} saleUuid={uuid} />)
    expect(
        screen.getByRole('button', { name: 'Hapus Permanen' }),
    ).toHaveProperty('disabled', true)
})

test('requires the sale code and reason, deletes, and refreshes affected data', async () => {
    const onDeleted = vi.fn()
    render(
        <DeleteSaleButton
            disabled={false}
            onDeleted={onDeleted}
            saleUuid={uuid}
        />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus Permanen' }))
    const confirm = screen.getByRole('button', { name: 'Yakin' })
    expect(confirm).toHaveProperty('disabled', true)
    fireEvent.change(screen.getByLabelText('Kode penjualan'), {
        target: { value: '6ABCDEF' },
    })
    expect(confirm).toHaveProperty('disabled', true)
    fireEvent.change(screen.getByLabelText('Alasan penghapusan'), {
        target: { value: 'Penjualan duplikat' },
    })
    fireEvent.click(confirm)
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
    expect(mocks.remove).toHaveBeenCalledWith(
        `repair-shop/sales/${uuid}/permanent`,
        { data: { reason: 'Penjualan duplikat' } },
    )
    const matches = mocks.mutate.mock.calls[0][0] as (key: unknown) => boolean
    expect(matches(['repair-shop/sales/datatable', {}])).toBe(true)
    expect(matches('repair-shop/sales/get-sales-report-data')).toBe(true)
    expect(matches('/repair-shop/spare-parts/datatable')).toBe(true)
    expect(matches(['transactions/datatable-data', {}])).toBe(true)
    expect(matches('receivables/report')).toBe(true)
    expect(matches('users/datatable')).toBe(false)
})

test('keeps validation failures visible and treats a retry 404 as already deleted', async () => {
    const onDeleted = vi.fn()
    mocks.remove.mockRejectedValueOnce({
        response: {
            data: { errors: { sale: ['Riwayat stok tidak lengkap.'] } },
            status: 422,
        },
    })
    render(
        <DeleteSaleButton
            disabled={false}
            onDeleted={onDeleted}
            saleUuid={uuid}
        />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus Permanen' }))
    fireEvent.change(screen.getByLabelText('Kode penjualan'), {
        target: { value: '6ABCDEF' },
    })
    fireEvent.change(screen.getByLabelText('Alasan penghapusan'), {
        target: { value: 'Duplikat' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Yakin' }))
    await screen.findByText('Riwayat stok tidak lengkap.')
    expect(onDeleted).not.toHaveBeenCalled()
    mocks.remove.mockRejectedValueOnce({ response: { status: 404 } })
    fireEvent.click(screen.getByRole('button', { name: 'Yakin' }))
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
})
