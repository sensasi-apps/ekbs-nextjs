// types
import type { FormikProps } from 'formik'
import type CashType from '@/dataTypes/Cash'
// vendors
import axios from '@/lib/axios'
import { FastField, useFormik } from 'formik'
// materials
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// icons
import DeleteIcon from '@mui/icons-material/Delete'
// providers
import useAuth from '@/providers/Auth'
// components
import TextFieldFastableComponent from '../Global/Input/TextField/FastableComponent'
// utils
import errorCatcher from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import { mutate } from './List'
import UnsavedChangesConfirmationButtonAndDialog from '../Global/ConfirmationDialog/UnsavedChanges'

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
    handleSubmit,
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

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <Fade in={isSubmitting || isDeleting}>
                <LinearProgress />
            </Fade>

            <input type="hidden" name="uuid" value={values.uuid} />

            {errors.uuid && (
                <FormControl
                    style={{
                        marginTop: 0,
                        marginBottom: '1em',
                    }}>
                    <FormHelperText error={true}>*{errors.uuid}</FormHelperText>
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
                        disabled={isSubmitting || isDeleting}
                        component={TextFieldFastableComponent}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FastField
                        name="name"
                        label="Nama"
                        disabled={isSubmitting || isDeleting}
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

                <UnsavedChangesConfirmationButtonAndDialog
                    shouldConfirm={dirty}
                    onConfirm={handleReset}
                    buttonProps={{
                        disabled: isSubmitting || isDeleting,
                    }}
                />

                <LoadingButton
                    size="small"
                    type="submit"
                    color="info"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={isSubmitting || isDeleting}>
                    Simpan
                </LoadingButton>
            </div>
        </form>
    )
}
