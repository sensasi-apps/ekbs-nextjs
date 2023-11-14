// types
import type { FormikProps } from 'formik'
import type CashType from '@/dataTypes/Cash'
// vendors
import axios from '@/lib/axios'
import { FastField, Form, useFormik } from 'formik'
// materials
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
// icons
import DeleteIcon from '@mui/icons-material/Delete'
// providers
import useAuth from '@/providers/Auth'
// components
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
import FormLoadingBar from '@/components/Dialog/LoadingBar'
import TextFieldFastableComponent from '@/components/Global/Input/TextField/FastableComponent'
// utils
import errorCatcher from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import { mutate } from './List'

export const INITIAL_VALUES: CashType = {
    uuid: '',
    code: '',
    name: '',
} as any

export default function CashForm({
    dirty,
    errors,
    values,
    isSubmitting,
    handleReset,
    setErrors,
}: FormikProps<CashType>) {
    const { userHasPermission } = useAuth()

    const isNew = !values.uuid
    const isUserCanDelete = userHasPermission('cashes delete')
    const isZeroBalance = values?.balance === 0
    const isDeletable = !isNew && isUserCanDelete && isZeroBalance

    const { handleSubmit: handleDelete, isSubmitting: isDeleting } = useFormik({
        initialValues: {},
        onSubmit: () =>
            axios
                .delete(`cashes/${values.uuid}`)
                .then(() => {
                    mutate()
                    handleReset()
                })
                .catch(error => errorCatcher(error, setErrors)),
    })

    const isProcessing = isSubmitting || isDeleting
    const isOldDirty = dirty && !isNew

    return (
        <>
            <FormLoadingBar in={isProcessing} />
            <Form autoComplete="off" id="cash-form">
                <input type="hidden" name="uuid" value={values.uuid} />

                {errors.uuid && (
                    <FormControl
                        style={{
                            marginTop: 0,
                            marginBottom: '1em',
                        }}>
                        <FormHelperText error={true}>
                            *{errors.uuid}
                        </FormHelperText>
                    </FormControl>
                )}

                {!isNew && (
                    <Typography my={2}>
                        Saldo saat ini:{' '}
                        <b>{numberToCurrency(values?.balance ?? 0)}</b>
                    </Typography>
                )}

                <Grid container columnSpacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FastField
                            name="code"
                            label="Kode"
                            disabled={isProcessing}
                            component={TextFieldFastableComponent}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FastField
                            name="name"
                            label="Nama"
                            disabled={isProcessing}
                            component={TextFieldFastableComponent}
                        />
                    </Grid>
                </Grid>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.5em',
                        marginTop: '2em',
                    }}>
                    <span
                        style={{
                            flexGrow: 1,
                        }}>
                        {isDeletable && (
                            <LoadingButton
                                size="small"
                                onClick={() => handleDelete()}
                                color="error"
                                loading={isDeleting}
                                disabled={isSubmitting}>
                                <DeleteIcon />
                            </LoadingButton>
                        )}
                    </span>

                    <FormResetButton
                        dirty={dirty}
                        disabled={isProcessing}
                        form="cash-form"
                    />

                    <FormSubmitButton
                        oldDirty={isOldDirty}
                        disabled={isProcessing || !dirty}
                        loading={isSubmitting}
                        form="cash-form"
                    />
                </div>
            </Form>
        </>
    )
}
