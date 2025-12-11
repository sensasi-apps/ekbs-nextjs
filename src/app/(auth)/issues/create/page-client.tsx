'use client'

import { Formik } from 'formik'
import { useRouter } from 'next/navigation'
import FormikForm from '@/components/formik-form-v2'
import myAxios from '@/lib/axios'
import type TicketORM from '../_types/orms/ticket'
import FormFields from './form-fields'

export default function PageClient() {
    const { push } = useRouter()

    const initialValues: Partial<TicketORM> = {
        message: '',
        priority: 'medium',
        title: '',
    }

    return (
        <Formik
            component={() => (
                <FormikForm>
                    <FormFields />
                </FormikForm>
            )}
            initialValues={initialValues}
            onReset={() => push('/issues')}
            onSubmit={(values, { setErrors }) =>
                myAxios
                    .post('/issues/tickets/store', values)
                    .then(response => {
                        push(`/issues/${response.data}`)
                    })
                    .catch(error => {
                        if (error.response?.status === 422) {
                            setErrors(error.response.data.errors)
                        }
                    })
            }
        />
    )
}
