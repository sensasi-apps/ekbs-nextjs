// types

// icons
import DeleteIcon from '@mui/icons-material/Delete'
// materials
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/GridLegacy'
import Typography from '@mui/material/Typography'
import type { FormikProps } from 'formik'
import { FastField, Form, useFormik } from 'formik'
import FormLoadingBar from '@/components/Dialog/LoadingBar'
// components
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
import TextFieldFastableComponent from '@/components/text-field.fastable-component'
// enums
import CashPermission from '@/enums/permissions/Cash'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// vendors
import axios from '@/lib/axios'
import type CashType from '@/types/orms/cash'
import errorCatcher from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
// utils
import { mutate } from './list'

export const INITIAL_VALUES: Partial<CashType> = {}

export default function CashForm({
    dirty,
    errors,
    values,
    isSubmitting,
    handleReset,
    setErrors,
}: FormikProps<Partial<CashType>>) {
    const isAuthHasPermission = useIsAuthHasPermission()

    const isNew = !values.uuid
    const isUserCanDelete = isAuthHasPermission(CashPermission.DELETE)
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
                <input name="uuid" type="hidden" value={values.uuid} />

                {errors.uuid && (
                    <FormControl
                        style={{
                            marginBottom: '1em',
                            marginTop: 0,
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

                <Grid columnSpacing={2} container>
                    <Grid item sm={6} xs={12}>
                        <FastField
                            component={TextFieldFastableComponent}
                            disabled={isProcessing}
                            label="Kode"
                            name="code"
                        />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FastField
                            component={TextFieldFastableComponent}
                            disabled={isProcessing}
                            label="Nama"
                            name="name"
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
                            <Button
                                color="error"
                                disabled={isSubmitting}
                                loading={isDeleting}
                                onClick={() => handleDelete()}
                                size="small">
                                <DeleteIcon />
                            </Button>
                        )}
                    </span>

                    <FormResetButton
                        dirty={dirty}
                        disabled={isProcessing}
                        form="cash-form"
                    />

                    <FormSubmitButton
                        disabled={isProcessing || !dirty}
                        form="cash-form"
                        loading={isSubmitting}
                        oldDirty={isOldDirty}
                    />
                </div>
            </Form>
        </>
    )
}
