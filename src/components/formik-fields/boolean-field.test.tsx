import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form, Formik } from 'formik'
import { expect, test, vi } from 'vitest'
import '@/test-utils/mock-setup'
import BooleanField from './boolean-field'

test('submits the latest value immediately after toggling', async () => {
    const onSubmit = vi.fn()

    render(
        <Formik
            initialStatus={{ isDisabled: false }}
            initialValues={{ paid: false }}
            onSubmit={onSubmit}>
            <Form aria-label="Form penjualan">
                <BooleanField checkbox label="Sudah Dibayar" name="paid" />
                <button type="submit">Simpan</button>
            </Form>
        </Formik>,
    )

    const checkbox = screen.getByRole('checkbox', {
        name: 'Sudah Dibayar',
    })

    fireEvent.click(checkbox)
    await new Promise(resolve => setTimeout(resolve, 300))
    fireEvent.click(checkbox)
    fireEvent.submit(screen.getByRole('form', { name: 'Form penjualan' }))

    await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
            { paid: false },
            expect.any(Object),
        )
    })
})
