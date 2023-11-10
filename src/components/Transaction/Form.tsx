// types
import type TransactionType from '@/dataTypes/Transaction'
import type ActivityLogType from '@/dataTypes/ActivityLog'
// vendors
import axios from '@/lib/axios'
import dayjs from 'dayjs'
import {
    FastField,
    FastFieldProps,
    Field,
    FormikProps,
    useFormik,
} from 'formik'
import { useState, memo } from 'react'
// materials
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import LinearProgress from '@mui/material/LinearProgress'
import LoadingButton from '@mui/lab/LoadingButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
// icons
import DeleteIcon from '@mui/icons-material/Delete'
// components
import DatePicker from '@/components/Global/DatePickerDayJs'
import NumericFormat from '@/components/Global/Input/NumericFormat'
import RpInputAdornment from '@/components/Global/InputAdornment/Rp'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextFieldFastableComponent from '@/components/Global/Input/TextField/FastableComponent'
import UserActivityLogsDialogTable from '@/components/UserActivityLogs/DialogTable'
// providers
import useAuth from '@/providers/Auth'
// utils
import errorCatcher from '@/utils/errorCatcher'
import toYmd from '@/utils/toYmd'
import UnsavedChangesConfirmationButtonAndDialog from '../Global/ConfirmationDialog/UnsavedChanges'

export default function TransactionForm({
    dirty,
    errors: validationErrors,
    handleReset,
    handleSubmit,
    isSubmitting,
    values: transaction,
}: FormikProps<TransactionInitialType | TransactionType>) {
    const { handleSubmit: handleDelete, isSubmitting: isDeleting } = useFormik({
        initialValues: {},
        onSubmit: (_, { setErrors }) =>
            axios
                .delete(`/transactions/${transaction.uuid}`)
                .then(() => handleReset())
                .catch(error => errorCatcher(error, setErrors)),
    })

    const { userHasPermission } = useAuth()
    const isUserCanDelete = userHasPermission('transactions delete')

    const isProcessing = isSubmitting || isDeleting

    const isDisabled =
        isProcessing ||
        transaction.is_transaction_destination ||
        Boolean(transaction.transactionable)

    return (
        <>
            <Fade in={isProcessing} unmountOnExit>
                <LinearProgress />
            </Fade>

            <form onSubmit={handleSubmit} autoComplete="off">
                <FastField name="uuid">
                    {({ field }: FastFieldProps) => {
                        if (field.value) {
                            return (
                                <div
                                    style={{
                                        marginBottom: 16,
                                        textAlign: 'end',
                                    }}>
                                    <LogButtonAndDialog
                                        disabled={isProcessing}
                                        data={transaction.user_activity_logs}
                                    />

                                    <TextField
                                        size="small"
                                        disabled
                                        fullWidth
                                        id="uuid"
                                        margin="none"
                                        variant="filled"
                                        label="Kode Transaksi"
                                        value={transaction.uuid}
                                        error={Boolean(validationErrors.uuid)}
                                        helperText={validationErrors.uuid}
                                    />
                                </div>
                            )
                        }
                    }}
                </FastField>

                <FastField name="type">
                    {({ field }: FastFieldProps) => (
                        <FormControl
                            margin="dense"
                            required
                            disabled={isDisabled}>
                            <FormLabel id="type">Jenis Transaksi</FormLabel>
                            <RadioGroup row aria-labelledby="type" {...field}>
                                <FormControlLabel
                                    value="income"
                                    control={<Radio required />}
                                    label="Masuk"
                                />
                                <FormControlLabel
                                    value="expense"
                                    control={<Radio />}
                                    label="Keluar"
                                />
                                <FormControlLabel
                                    value="transfer"
                                    control={<Radio />}
                                    label="Transfer"
                                />
                            </RadioGroup>
                        </FormControl>
                    )}
                </FastField>

                <FastField name="at">
                    {({ field, meta, form }: FastFieldProps) => (
                        <DatePicker
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    margin: 'dense',
                                    size: 'small',
                                    error: Boolean(meta.error),
                                    helperText: meta.error,
                                    name: field.name,
                                },
                            }}
                            label="Tanggal"
                            disabled={isDisabled}
                            onChange={value =>
                                form.setFieldValue(
                                    field.name,
                                    value ? toYmd(value) : '',
                                )
                            }
                            value={dayjs(field.value)}
                        />
                    )}
                </FastField>

                <Field name="cashable_uuid" label>
                    {({
                        field: { name, value, onBlur, onChange },
                        meta: { error },
                        form: {
                            values: {
                                type,
                                to_cash_uuid,
                                is_transaction_destination,
                            },
                            errors,
                            setFieldValue,
                        },
                    }: FastFieldProps) => {
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.5em',
                                }}>
                                <SelectFromApi
                                    required
                                    endpoint="/data/cashes"
                                    label={
                                        type === 'income'
                                            ? 'Ke Kas'
                                            : 'Dari Kas'
                                    }
                                    size="small"
                                    margin="dense"
                                    disabled={isDisabled}
                                    selectProps={{
                                        value: value,
                                        name: name,
                                        onBlur: onBlur,
                                    }}
                                    error={Boolean(error)}
                                    helperText={error}
                                    onChange={onChange}
                                />

                                {type === 'transfer' &&
                                    !is_transaction_destination && (
                                        <SelectFromApi
                                            required
                                            endpoint="/data/cashes"
                                            label="Ke Kas"
                                            size="small"
                                            margin="dense"
                                            disabled={isDisabled}
                                            selectProps={{
                                                value: to_cash_uuid,
                                                name: 'to_cash_uuid',
                                            }}
                                            error={Boolean(errors.to_cash_uuid)}
                                            helperText={
                                                errors.to_cash_uuid as string
                                            }
                                            onChange={event =>
                                                setFieldValue(
                                                    'to_cash_uuid',
                                                    'value' in event.target
                                                        ? event.target.value
                                                        : '',
                                                )
                                            }
                                        />
                                    )}
                            </div>
                        )
                    }}
                </Field>

                <FastField name="amount">
                    {({
                        field: { value, name },
                        form: { setFieldValue },
                        meta: { error },
                    }: FastFieldProps) => {
                        return (
                            <NumericFormat
                                disabled={isDisabled}
                                label="Jumlah"
                                value={value}
                                name={name}
                                onValueChange={({ value }) =>
                                    setFieldValue(name, value)
                                }
                                InputProps={{
                                    startAdornment: <RpInputAdornment />,
                                }}
                                error={Boolean(error)}
                                helperText={error}
                                inputProps={{
                                    minLength: 1,
                                    maxLength: 19,
                                }}
                            />
                        )
                    }}
                </FastField>

                <FastField
                    name="desc"
                    component={TextFieldFastableComponent}
                    multiline
                    disabled={isDisabled}
                    rows={2}
                    label="Deskripsi"
                />

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
                        {transaction.uuid && isUserCanDelete && (
                            <LoadingButton
                                color="error"
                                onClick={() => handleDelete()}
                                loading={isDeleting}
                                disabled={isDisabled}>
                                <DeleteIcon />
                            </LoadingButton>
                        )}
                    </span>

                    <UnsavedChangesConfirmationButtonAndDialog
                        shouldConfirm={dirty}
                        onConfirm={handleReset}
                        buttonProps={{
                            disabled: isProcessing,
                        }}
                    />

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="info"
                        loading={isSubmitting}
                        disabled={isDisabled}>
                        Simpan
                    </LoadingButton>
                </div>
            </form>
        </>
    )
}

const LogButtonAndDialog = memo(function LogButtonAndDialog({
    disabled,
    data,
}: {
    disabled: boolean
    data: ActivityLogType[]
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                disabled={disabled}
                onClick={() => setOpen(true)}
                size="small">
                Lihat Riwayat
            </Button>

            <UserActivityLogsDialogTable
                open={open}
                setIsOpen={setOpen}
                data={data}
            />
        </>
    )
})

export type TransactionInitialType = {
    uuid: ''
    cashable_uuid: ''
    at: ''
    amount: ''
    desc: ''
    type: ''
    to_cash_uuid: ''
    is_transaction_destination: false
    transactionable: null
    user_activity_logs: []
}

export const INITIAL_VALUES: TransactionInitialType = {
    uuid: '',
    type: '',
    cashable_uuid: '',
    at: '',
    amount: '',
    desc: '',

    to_cash_uuid: '',
    is_transaction_destination: false,
    transactionable: null,
    user_activity_logs: [],
}
