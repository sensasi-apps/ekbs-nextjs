// types
import type { ReactNode } from 'react'
import type CashType from '@/dataTypes/Cash'
// vendors
import axios from '@/lib/axios'
import { useFormik, useFormikContext } from 'formik'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// icons
import DeleteIcon from '@mui/icons-material/Delete'
// providers
import useAuth from '@/providers/Auth'
// utils
import errorCatcher from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import { mutate } from './List'

export const initialValues: CashType = {
    uuid: '',
    code: '',
    name: '',
} as any

export default function CashForm() {
    const { userHasPermission } = useAuth()
    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        setErrors,
    } = useFormikContext<CashType>()

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
        <>
            <form onSubmit={handleSubmit} autoComplete="off">
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
                        <TextField
                            disabled={isSubmitting || isDeleting}
                            fullWidth
                            required
                            margin="dense"
                            size="small"
                            name="code"
                            label="Kode"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.code}
                            error={Boolean(errors.code)}
                            helperText={errors.code as ReactNode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            disabled={isSubmitting || isDeleting}
                            required
                            margin="dense"
                            name="name"
                            label="Nama"
                            onChange={handleChange}
                            value={values.name}
                            error={Boolean(errors.name)}
                            helperText={errors.name as ReactNode}
                        />
                    </Grid>
                </Grid>

                <Box
                    mt={4}
                    display="flex"
                    justifyContent={isDeletable ? 'space-between' : 'end'}>
                    {isDeletable && (
                        <LoadingButton
                            size="small"
                            type="submit"
                            form="delete-form"
                            color="error"
                            loading={isDeleting}
                            disabled={isSubmitting}
                            startIcon={<DeleteIcon />}
                        />
                    )}

                    <Box display="flex" gap={1}>
                        <Button
                            size="small"
                            type="reset"
                            color="info"
                            disabled={isSubmitting || isDeleting}
                            onClick={handleReset}>
                            Batal
                        </Button>

                        <LoadingButton
                            size="small"
                            type="submit"
                            color="info"
                            variant="contained"
                            loading={isSubmitting}
                            disabled={isSubmitting || isDeleting}>
                            Simpan
                        </LoadingButton>
                    </Box>
                </Box>
            </form>

            {isDeletable && <form onSubmit={handleDelete} id="delete-form" />}
        </>
    )
}
