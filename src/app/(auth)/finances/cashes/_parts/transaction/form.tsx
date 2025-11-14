// types

// icons
import DeleteIcon from '@mui/icons-material/Delete'
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
import type { AxiosError } from 'axios'
import dayjs from 'dayjs'
import {
    FastField,
    type FastFieldProps,
    Field,
    type FieldProps,
    Form,
    type FormikProps,
    useFormik,
} from 'formik'
// vendors
import { useState } from 'react'
import FormLoadingBar from '@/components/Dialog/LoadingBar'
// components
import DatePicker from '@/components/date-picker'
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
import SelectFromApi from '@/components/Global/SelectFromApi'
import RpInputAdornment from '@/components/input-adornments/rp'
import NumericFormat from '@/components/numeric-format'
import TextField from '@/components/text-field'
import TextFieldFastableComponent from '@/components/text-field.fastable-component'
import UserActivityLogs from '@/components/user-activity-logs'
// enums
import TransactionPermission from '@/enums/permissions/Transaction'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import txAccounts from '@/modules/transaction/statics/tx-accounts'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import type BusinessUnitCash from '@/types/orms/business-unit-cash'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import handle422 from '@/utils/handle-422'
import shortUuid from '@/utils/short-uuid'

export default function TransactionForm({
    dirty,
    errors,
    handleReset,
    isSubmitting,
    values,
    status,
    setFieldValue,
}: FormikProps<FormValuesType>) {
    const txFromDB = status as TransactionORM | undefined

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

    const isAuthHasPermission = useIsAuthHasPermission()
    const isUserCanDelete = isAuthHasPermission(TransactionPermission.DELETE)

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
                            disabled
                            fullWidth
                            id="uuid"
                            label="Kode Transaksi"
                            margin="none"
                            size="small"
                            value={shortUuid(txFromDB?.uuid)}
                            variant="filled"
                            {...errorsToHelperTextObj(validationErrorMsg)}
                        />
                    </div>
                )}

                <FastField name="type">
                    {({
                        field: { onChange, value, ...restField },
                    }: FastFieldProps) => (
                        <FormControl
                            disabled={isDisabled}
                            margin="dense"
                            required>
                            <FormLabel id="type">Jenis Transaksi</FormLabel>
                            <RadioGroup
                                aria-labelledby="type"
                                onChange={ev => {
                                    onChange(ev)

                                    if (ev.currentTarget.value === 'transfer') {
                                        setIsBuTx(false)
                                    }
                                }}
                                row
                                value={value ?? ''}
                                {...restField}>
                                <FormControlLabel
                                    control={<Radio required />}
                                    label="Masuk"
                                    value="income"
                                />

                                <FormControlLabel
                                    control={<Radio />}
                                    label="Keluar"
                                    value="expense"
                                />

                                <FormControlLabel
                                    control={<Radio />}
                                    label="Transfer"
                                    value="transfer"
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
                            disabled={isDisabled}
                            disableFuture
                            label="Tanggal"
                            onChange={value =>
                                setFieldValue(
                                    name,
                                    value?.format('YYYY-MM-DD') ?? '',
                                )
                            }
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: 'normal',
                                    name: name,
                                    required: true,
                                    sx: {
                                        mt: 2,
                                    },
                                    variant: 'standard',
                                    ...errorsToHelperTextObj(error),
                                },
                            }}
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
                                    disabled={isDisabled}
                                    endpoint="/data/cashes"
                                    error={Boolean(error)}
                                    helperText={error}
                                    label={
                                        type === 'income'
                                            ? 'Ke Kas'
                                            : 'Dari Kas'
                                    }
                                    margin="dense"
                                    onChange={onChange}
                                    required
                                    selectProps={{
                                        name: name,
                                        onBlur: onBlur,
                                        value: value ?? '',
                                    }}
                                    size="small"
                                />

                                {type === 'transfer' &&
                                    !is_transaction_destination && (
                                        <SelectFromApi
                                            disabled={isDisabled}
                                            endpoint="/data/cashes"
                                            error={Boolean(errors.to_cash_uuid)}
                                            helperText={
                                                errors.to_cash_uuid as string
                                            }
                                            label="Ke Kas"
                                            margin="dense"
                                            onChange={event =>
                                                setFieldValue(
                                                    'to_cash_uuid',
                                                    'value' in event.target
                                                        ? event.target.value
                                                        : '',
                                                )
                                            }
                                            required
                                            selectProps={{
                                                name: 'to_cash_uuid',
                                                value: to_cash_uuid ?? '',
                                            }}
                                            size="small"
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
                            control={<Checkbox checked={isBuTx} />}
                            disabled={isDisabled}
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
                                    disabled={isDisabled}
                                    endpoint="/data/business-unit-cashes"
                                    label="Unit Bisnis"
                                    margin="dense"
                                    onChange={onChange}
                                    renderOption={(
                                        buCash: BusinessUnitCash,
                                    ) => (
                                        <MenuItem
                                            key={buCash.uuid}
                                            value={buCash.uuid}>
                                            {buCash.business_unit?.name}
                                        </MenuItem>
                                    )}
                                    required
                                    selectProps={{
                                        name: name,
                                        onBlur: onBlur,
                                        value: value ?? '',
                                    }}
                                    size="small"
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
                            disabled={isDisabled}
                            onChange={(_, newValue) =>
                                setFieldValue(name, newValue)
                            }
                            options={accOpts}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Akun Transaksi"
                                    name={name}
                                    {...errorsToHelperTextObj(errors.tag)}
                                />
                            )}
                            value={value ?? ''}
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
                                error={Boolean(error)}
                                helperText={error}
                                InputProps={{
                                    startAdornment: <RpInputAdornment />,
                                }}
                                inputProps={{
                                    maxLength: 19,
                                    minLength: 1,
                                }}
                                label="Jumlah"
                                margin="normal"
                                name={name}
                                onValueChange={({ value }) =>
                                    setFieldValue(name, value)
                                }
                                size="medium"
                                value={value}
                                variant="standard"
                            />
                        )
                    }}
                </FastField>

                <FastField
                    component={TextFieldFastableComponent}
                    disabled={isDisabled}
                    label="Deskripsi"
                    multiline
                    name="desc"
                    required
                    variant="standard"
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
                                disabled={isDisabled}
                                loading={isDeleting}
                                onClick={() => handleDelete()}>
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
                        disabled={isDisabled || !dirty}
                        form="transaction-form"
                        loading={isSubmitting}
                        oldDirty={isOldDirty}
                    />
                </div>
            </Form>
        </>
    )
}

export type FormValuesType = Partial<{
    cashable_uuid: TransactionORM['cashable_uuid']
    at: TransactionORM['at']
    amount: TransactionORM['amount']
    desc: TransactionORM['desc']
    type: TransactionORM['type']
    to_cash_uuid: TransactionORM['to_cash_uuid']
    tag: TransactionORM['tags'][0]['name']['id']
}>

export function transactionToFormValues({
    cashable_uuid,
    at,
    amount,
    desc,
    type,
    to_cash_uuid,
    tags,
}: TransactionORM): FormValuesType {
    return {
        amount,
        at,
        cashable_uuid,
        desc,
        tag: tags?.[0]?.name?.id,
        to_cash_uuid,
        type,
    }
}
