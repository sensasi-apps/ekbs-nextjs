// types
import type { AxiosError } from 'axios'
import type BusinessUnitCash from '@/dataTypes/BusinessUnitCash'
import type { Transaction } from '@/dataTypes/Transaction'
// vendors
import { useState } from 'react'
import {
    FastField,
    type FastFieldProps,
    Field,
    type FieldProps,
    Form,
    type FormikProps,
    useFormik,
} from 'formik'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
// icons
import DeleteIcon from '@mui/icons-material/Delete'
// components
import DatePicker from '@/components/DatePicker'
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
import FormLoadingBar from '@/components/Dialog/LoadingBar'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextField from '@/components/TextField'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import UserActivityLogs from '@/components/UserActivityLogs'
// providers
import useAuth from '@/providers/Auth'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import txAccounts from '../../../../features/transaction/statics/tx-accounts'
import handle422 from '@/utils/errorCatcher'
import type LaravelValidationException from '@/types/LaravelValidationException'
import shortUuid from '@/utils/uuidToShort'

export default function TransactionForm({
    dirty,
    errors,
    handleReset,
    isSubmitting,
    values,
    status,
    setFieldValue,
}: FormikProps<FormValuesType>) {
    const txFromDB = status as Transaction | undefined

    const [validationErrorMsg, setValidationErrorMsg] = useState<string>()
    const [isBuTx, setIsBuTx] = useState<boolean>(Boolean(values.to_cash_uuid))

    const { handleSubmit: handleDelete, isSubmitting: isDeleting } = useFormik({
        initialValues: {},
        onSubmit: (_, { setErrors }) =>
            axios
                .delete(`/transactions/${txFromDB?.uuid}`)
                .then(() => handleReset())
                .catch((errorRes: AxiosError<LaravelValidationException>) => {
                    handle422(errorRes, setErrors)
                    setValidationErrorMsg(errorRes.message)
                }),
    })

    const { userHasPermission } = useAuth()
    const isUserCanDelete = userHasPermission('transactions delete')

    const isProcessing = isSubmitting || isDeleting

    const isDisabled =
        isProcessing ||
        txFromDB?.is_transaction_destination ||
        Boolean(txFromDB?.transactionable)

    const isOldDirty = dirty && !txFromDB?.uuid

    const accOpts =
        values.type && (values.type === 'income' || values.type === 'expense')
            ? txAccounts[values.type]
            : []

    return (
        <>
            <FormLoadingBar in={isProcessing} />
            <Form autoComplete="off" id="transaction-form">
                {txFromDB?.uuid && (
                    <div
                        style={{
                            marginBottom: 16,
                            textAlign: 'end',
                        }}>
                        {txFromDB?.user_activity_logs && (
                            <UserActivityLogs
                                data={txFromDB.user_activity_logs}
                            />
                        )}

                        <TextField
                            size="small"
                            disabled
                            fullWidth
                            id="uuid"
                            margin="none"
                            variant="filled"
                            label="Kode Transaksi"
                            value={shortUuid(txFromDB?.uuid)}
                            {...errorsToHelperTextObj(validationErrorMsg)}
                        />
                    </div>
                )}

                <FastField name="type">
                    {({
                        field: { onChange, value, ...restField },
                    }: FastFieldProps) => (
                        <FormControl
                            margin="dense"
                            required
                            disabled={isDisabled}>
                            <FormLabel id="type">Jenis Transaksi</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="type"
                                value={value ?? ''}
                                onChange={ev => {
                                    onChange(ev)

                                    if (ev.currentTarget.value === 'transfer') {
                                        setIsBuTx(false)
                                    }
                                }}
                                {...restField}>
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
                    {({
                        field: { name, value },
                        meta: { error },
                        form: { setFieldValue },
                    }: FastFieldProps) => (
                        <DatePicker
                            disableFuture
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    variant: 'standard',
                                    margin: 'normal',
                                    name: name,
                                    sx: {
                                        mt: 2,
                                    },
                                    ...errorsToHelperTextObj(error),
                                },
                            }}
                            label="Tanggal"
                            disabled={isDisabled}
                            onChange={value =>
                                setFieldValue(
                                    name,
                                    value?.format('YYYY-MM-DD') ?? '',
                                )
                            }
                            value={dayjs(value)}
                        />
                    )}
                </FastField>

                <Field name="cashable_uuid">
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
                                        value: value ?? '',
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
                                                value: to_cash_uuid ?? '',
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

                {values.type !== 'transfer' && (
                    <FormGroup
                        onChange={() =>
                            setIsBuTx(prev => {
                                if (prev) {
                                    setFieldValue('to_cash_uuid', undefined)
                                }

                                return !prev
                            })
                        }>
                        <FormControlLabel
                            disabled={isDisabled}
                            control={<Checkbox checked={isBuTx} />}
                            label="Transaksi Unit Bisnis"
                        />
                    </FormGroup>
                )}

                {isBuTx && (
                    <Field name="to_cash_uuid">
                        {({
                            field: { name, value, onBlur, onChange },
                            meta: { error },
                        }: FastFieldProps) => {
                            return (
                                <SelectFromApi
                                    required
                                    disabled={isDisabled}
                                    endpoint="/data/business-unit-cashes"
                                    label="Unit Bisnis"
                                    size="small"
                                    margin="dense"
                                    selectProps={{
                                        value: value ?? '',
                                        name: name,
                                        onBlur: onBlur,
                                    }}
                                    renderOption={(
                                        buCash: BusinessUnitCash,
                                    ) => (
                                        <MenuItem
                                            key={buCash.uuid}
                                            value={buCash.uuid}>
                                            {buCash.business_unit?.name}
                                        </MenuItem>
                                    )}
                                    onChange={onChange}
                                    {...errorsToHelperTextObj(error)}
                                />
                            )
                        }}
                    </Field>
                )}

                <Field name="tag">
                    {({
                        field: { name, value },
                        form: { setFieldValue },
                    }: FieldProps<string>) => (
                        <Autocomplete
                            options={accOpts}
                            value={value ?? ''}
                            disabled={isDisabled}
                            onChange={(_, newValue) =>
                                setFieldValue(name, newValue)
                            }
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Akun Transaksi"
                                    name={name}
                                    {...errorsToHelperTextObj(errors.tag)}
                                />
                            )}
                        />
                    )}
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
                                margin="normal"
                                size="medium"
                                label="Jumlah"
                                value={value}
                                name={name}
                                variant="standard"
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
                    required
                    variant="standard"
                    component={TextFieldFastableComponent}
                    multiline
                    disabled={isDisabled}
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
                        {txFromDB?.uuid && isUserCanDelete && (
                            <Button
                                color="error"
                                onClick={() => handleDelete()}
                                loading={isDeleting}
                                disabled={isDisabled}>
                                <DeleteIcon />
                            </Button>
                        )}
                    </span>

                    <FormResetButton
                        dirty={dirty}
                        disabled={isProcessing}
                        form="transaction-form"
                    />

                    <FormSubmitButton
                        oldDirty={isOldDirty}
                        disabled={isDisabled || !dirty}
                        loading={isSubmitting}
                        form="transaction-form"
                    />
                </div>
            </Form>
        </>
    )
}

export type FormValuesType = Partial<{
    cashable_uuid: Transaction['cashable_uuid']
    at: Transaction['at']
    amount: Transaction['amount']
    desc: Transaction['desc']
    type: Transaction['type']
    to_cash_uuid: Transaction['to_cash_uuid']
    tag: Transaction['tags'][0]['name']['id']
}>

export function transactionToFormValues({
    cashable_uuid,
    at,
    amount,
    desc,
    type,
    to_cash_uuid,
    tags,
}: Transaction): FormValuesType {
    return {
        cashable_uuid,
        at,
        amount,
        desc,
        type,
        to_cash_uuid,
        tag: tags?.[0]?.name?.id,
    }
}
