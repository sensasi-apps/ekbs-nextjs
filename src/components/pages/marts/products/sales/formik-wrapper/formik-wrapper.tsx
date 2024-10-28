// types
import type { FormValuesType, FormikStatusType } from '.'
import type { AxiosError } from 'axios'
import type LaravelValidationException from '@/types/LaravelValidationException'
// vendors
import { Field, Formik } from 'formik'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
import Grid2 from '@mui/material/Unstable_Grid2'
// local components
import ApiUrl from '@/components/pages/marts/products/sales/@enums/api-url'
import ProductPicker from '../product-picker'
import CreateSaleFormWrapper from './components/create-sale-form-wrapper'
// etc
import handle422 from '@/utils/errorCatcher'
import { VALIDATION_SCHEMA } from './statics/validation-scheme'

export function FormikWrapper() {
    return (
        <Formik<FormValuesType>
            initialValues={JSON.parse(JSON.stringify(DEFAULT_FORM_VALUES))}
            initialStatus={{ ...DEFAULT_STATUS }}
            onSubmit={async (values, { setErrors, setStatus }) => {
                const submittedData = {
                    ...values,
                    at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    paid: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                }

                return axios
                    .post(ApiUrl.STORE, submittedData)
                    .then(() => {
                        setStatus({
                            isDisabled: true,
                            isFormOpen: true,
                            submittedData: {
                                ...submittedData,
                            },
                        })
                    })
                    .catch((err: AxiosError<LaravelValidationException>) =>
                        handle422(err, setErrors),
                    )
            }}
            onReset={(_, { setValues, setStatus }) => {
                setValues(JSON.parse(JSON.stringify(DEFAULT_FORM_VALUES)))
                setStatus({ ...DEFAULT_STATUS })
            }}
            validationSchema={VALIDATION_SCHEMA}
            validateOnBlur={false}
            validateOnChange={false}>
            <>
                <Grid2 xs={12} md={8}>
                    <Field name="details" component={ProductPicker} />
                </Grid2>

                <Grid2 xs={12} md={4}>
                    <CreateSaleFormWrapper />
                </Grid2>
            </>
        </Formik>
    )
}

export const DEFAULT_FORM_VALUES: FormValuesType = {
    details: [],
    costs: [],
}

const DEFAULT_STATUS: FormikStatusType = {
    isDisabled: false,
    isFormOpen: false,
}
