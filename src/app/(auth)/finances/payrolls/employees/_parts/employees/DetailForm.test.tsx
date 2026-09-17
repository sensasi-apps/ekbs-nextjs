import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Formik } from 'formik'
import { expect, test, vi } from 'vitest'
import '@/test-utils/mock-setup'
import PayrollEmployeeDetailsForm, { type FormikValues } from './DetailForm'

test('submits an autocomplete selection', async () => {
    const onSubmit = vi.fn()

    render(
        <Formik<FormikValues>
            initialStatus={{ user_state: { name: 'Employee' } }}
            initialValues={{
                details: [
                    {
                        amount_rp: 0,
                        name: 'Rincian 1',
                        payroll_user_detailable_id: null,
                        seq_no: 0,
                        uuid: '00000000-0000-0000-0000-000000000001',
                    },
                ],
            }}
            onSubmit={onSubmit}>
            {formikProps => (
                <PayrollEmployeeDetailsForm
                    {...formikProps}
                    handleDelete={vi.fn()}
                    isDeleting={false}
                />
            )}
        </Formik>,
    )

    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'SPP' }))
    fireEvent.submit(document.getElementById('employee-details-form')!)

    await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
            {
                details: [
                    expect.objectContaining({
                        name: 'SPP',
                    }),
                ],
            },
            expect.any(Object),
        )
    })
}, 10_000)
