import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import Page from './page'

const mocks = vi.hoisted(() => ({
    get: vi.fn(),
    params: {} as Record<string, string>,
    replace: vi.fn(),
}))
vi.mock('next/navigation', () => ({
    useParams: () => mocks.params,
    useRouter: () => ({ back: vi.fn(), replace: mocks.replace }),
}))
vi.mock('@/lib/axios', () => ({ default: { get: mocks.get } }))
vi.mock(
    '@/app/(auth)/repair-shop/spare-part-purchases/_parts/component/purchase-form-dialog',
    () => ({
        default: ({ onDeleted }: { onDeleted: () => void }) => (
            <button onClick={onDeleted} type="button">
                Pembelian dihapus
            </button>
        ),
    }),
)
afterEach(cleanup)
beforeEach(() => {
    vi.clearAllMocks()
    mocks.params = {}
})

test('Page renders without crashing', () => {
    render(<Page />)
})

test('returns to purchase history after successful deletion', async () => {
    const uuid = '019a1234-1234-7123-8123-123456abcdef'
    mocks.params = { uuid }
    mocks.get.mockResolvedValue({ data: { type: 'purchase', uuid } })

    render(<Page />)
    fireEvent.click(
        await screen.findByRole('button', { name: 'Pembelian dihapus' }),
    )

    expect(mocks.get).toHaveBeenCalledWith(
        `repair-shop/spare-parts/purchases/${uuid}`,
    )
    expect(mocks.replace).toHaveBeenCalledWith(
        '/repair-shop/spare-part-purchases',
    )
})
