'use client'

import Grid from '@mui/material/Grid'
import type { AxiosError } from 'axios'
import dayjs from 'dayjs'
// vendors
import { Field, Formik } from 'formik'
// local components
import ApiUrl from '@/app/mart-product-sales/_parts/enums/api-url'
import axios from '@/lib/axios'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
// etc
import handle422 from '@/utils/handle-422'
import ProductPicker from '../product-picker'
// types
import type { FormikStatusType, FormValuesType } from '.'
import CreateSaleFormWrapper from './components/create-sale-form-wrapper'
import { VALIDATION_SCHEMA } from './statics/validation-scheme'

export function FormikWrapper() {
    return (
        <Formik<FormValuesType>
            initialStatus={{ ...DEFAULT_STATUS }}
            initialValues={JSON.parse(JSON.stringify(DEFAULT_FORM_VALUES))}
            onReset={(_, { setValues, setStatus }) => {
                setValues(JSON.parse(JSON.stringify(DEFAULT_FORM_VALUES)))
                setStatus({ ...DEFAULT_STATUS })
            }}
            onSubmit={async (values, { setErrors, setStatus }) => {
                const submittedData = {
                    ...values,
                    at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    paid: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                }

                return axios
                    .post<null>(ApiUrl.STORE, submittedData)
                    .then(() => {
                        setStatus({
                            isDisabled: true,
                            isFormOpen: true,
                            submittedData: {
                                ...submittedData,
                            },
                        })

                        dispatchEvent(new CustomEvent('mart-sale-queued'))
                    })
                    .catch((err: AxiosError<LaravelValidationException>) =>
                        handle422(err, setErrors),
                    )
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={VALIDATION_SCHEMA}>
            <>
                <Grid
                    size={{
                        md: 8,
                        xs: 12,
                    }}>
                    <Field component={ProductPicker} name="details" />
                </Grid>

                <Grid
                    size={{
                        md: 4,
                        xs: 12,
                    }}>
                    <CreateSaleFormWrapper />
                </Grid>
            </>
        </Formik>
    )
}

const DEFAULT_FORM_VALUES: FormValuesType = {
    costs: [],
    details: [],
}

const DEFAULT_STATUS: FormikStatusType = {
    isDisabled: false,
    isFormOpen: false,
}
