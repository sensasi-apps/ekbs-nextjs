import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import { Field, Form } from 'formik'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import PurchaseFormDialog from './purchase-form-dialog'

const mocks = vi.hoisted(() => ({
    mutate: vi.fn(() => Promise.resolve()),
    remove: vi.fn(),
    save: vi.fn(),
}))
vi.mock('@/hooks/use-is-auth-has-role', () => ({ default: () => () => true }))
vi.mock('@/lib/axios', () => ({
    default: { delete: mocks.remove, post: mocks.save, put: mocks.save },
}))
vi.mock('swr', () => ({ useSWRConfig: () => ({ mutate: mocks.mutate }) }))
vi.mock('@mui/material/Dialog', () => ({
    default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/formik-fields/date-field', () => ({
    default: () => null,
}))
vi.mock('@/components/formik-fields/text-field', () => ({
    default: ({
        name,
        label,
        disabled,
    }: {
        name: string
        label: string
        disabled: boolean
    }) => <Field aria-label={label} disabled={disabled} name={name} />,
}))
vi.mock('@/components/Global/SelectFromApi', () => ({ default: () => null }))
vi.mock('./costs-field', () => ({ default: () => null }))
vi.mock('./details-field', () => ({ default: () => null }))
vi.mock('@/components/formik-form', () => ({
    default: ({
        children,
        processing,
        slotProps,
    }: {
        children: ReactNode
        processing: boolean
        slotProps: { submitButton: { disabled: boolean } }
    }) => (
        <Form data-testid="purchase-form">
            {children}
            <button disabled={slotProps.submitButton.disabled} type="submit">
                Simpan
            </button>
            <button disabled={processing} type="reset">
                Tutup
            </button>
        </Form>
    ),
}))
afterEach(cleanup)
beforeEach(() => {
    vi.clearAllMocks()
    mocks.remove.mockResolvedValue({ status: 202 })
    mocks.save.mockResolvedValue({ status: 201 })
})
const uuid = '019a1234-1234-7123-8123-123456abcdef'

test('does not expose deletion for a new unsaved purchase', () => {
    render(<PurchaseFormDialog formData={undefined} handleClose={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Hapus Permanen' })).toBeNull()
})

test('allows deleting a finalized purchase while keeping its save action disabled', async () => {
    const onDeleted = vi.fn()
    render(
        <PurchaseFormDialog
            formData={{ finalized_at: '2026-10-04', note: '', uuid }}
            handleClose={vi.fn()}
            onDeleted={onDeleted}
        />,
    )
    expect(screen.getByRole('button', { name: 'Simpan' })).toHaveProperty(
        'disabled',
        true,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus Permanen' }))
    fireEvent.change(screen.getByLabelText('Kode pembelian'), {
        target: { value: '6ABCDEF' },
    })
    fireEvent.change(screen.getByLabelText('Alasan penghapusan'), {
        target: { value: 'Duplikat' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Yakin' }))
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
    expect(mocks.save).not.toHaveBeenCalled()
})

test('blocks deletion and closing until a purchase save finishes even after repeated submit', async () => {
    let finish: ((value: unknown) => void) | undefined
    mocks.save.mockImplementationOnce(
        () =>
            new Promise(resolve => {
                finish = resolve
            }),
    )
    const close = vi.fn()
    render(
        <PurchaseFormDialog
            formData={{ finalized_at: null, note: '', uuid }}
            handleClose={close}
        />,
    )
    fireEvent.submit(screen.getByTestId('purchase-form'))
    await waitFor(() => expect(mocks.save).toHaveBeenCalledOnce())
    fireEvent.submit(screen.getByTestId('purchase-form'))
    await waitFor(() =>
        expect(
            screen.getByRole('button', { name: 'Hapus Permanen' }),
        ).toHaveProperty('disabled', true),
    )
    expect(screen.getByRole('button', { name: 'Tutup' })).toHaveProperty(
        'disabled',
        true,
    )
    expect(close).not.toHaveBeenCalled()
    finish?.({ status: 201 })
    await waitFor(() => expect(close).toHaveBeenCalledOnce())
    expect(mocks.save).toHaveBeenCalledOnce()
})

test('blocks saving and closing while purchase deletion is unresolved', async () => {
    let finish: ((value: unknown) => void) | undefined
    mocks.remove.mockImplementationOnce(
        () =>
            new Promise(resolve => {
                finish = resolve
            }),
    )
    const close = vi.fn()
    render(
        <PurchaseFormDialog
            formData={{ finalized_at: null, note: '', uuid }}
            handleClose={close}
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
    await waitFor(() => expect(mocks.remove).toHaveBeenCalledOnce())
    fireEvent.submit(screen.getByTestId('purchase-form'))
    await waitFor(() =>
        expect(
            screen.getByRole('button', { hidden: true, name: 'Simpan' }),
        ).toHaveProperty('disabled', true),
    )
    expect(
        screen.getByRole('button', { hidden: true, name: 'Tutup' }),
    ).toHaveProperty('disabled', true)
    expect(mocks.save).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()
    finish?.({ status: 202 })
    await waitFor(() => expect(close).toHaveBeenCalledOnce())
})
