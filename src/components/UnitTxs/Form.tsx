// types

// materials
// import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
// vendors
// import axios from '@/lib/axios'
import dayjs from 'dayjs'
import {
    FastField,
    type FastFieldProps,
    Field,
    Form,
    type FormikProps,
    // useFormik,
} from 'formik'
// icons
// import DeleteIcon from '@mui/icons-material/Delete'
// components
import DatePicker from '@/components/DatePicker'
import FormLoadingBar from '@/components/Dialog/LoadingBar'
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
import SelectFromApi from '@/components/Global/SelectFromApi'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import NumericFormat from '@/components/NumericFormat'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import BusinessUnit from '@/enums/business-unit'
// import UserActivityLogsDialogTable from '@/components/UserActivityLogs/DialogTable'
// providers
// import useAuth from '@/providers/Auth'
// utils
// import errorCatcher from '@/utils/errorCatcher'
import TransactionTag from '@/modules/transaction/enums/transaction-tag'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import getUnitTxTags from '@/utils/get-unit-tx-tags'

export default function UnitTxForm({
    dirty,
    // errors,
    // handleReset,
    isSubmitting,
    // values,
    status,
}: Omit<FormikProps<FormValues>, 'status'> & {
    status?: {
        businessUnit: BusinessUnit
    }
}) {
    // const { handleSubmit: handleDelete, isSubmitting: isDeleting } = useFormik({
    //     initialValues: {},
    //     onSubmit: (_, { setErrors }) =>
    //         axios
    //             .delete(`/transactions/${values.uuid}`)
    //             .then(() => handleReset())
    //             .catch(error => errorCatcher(error, setErrors)),
    // })

    const isProcessing = isSubmitting //|| isDeleting

    const isDisabled = isProcessing
    // || status?.is_transaction_destination ||
    // Boolean(status?.transactionable)

    const isOldDirty = dirty //&& !status?.uuid

    if (!status) throw new Error('status is required')

    return (
        <>
            <FormLoadingBar in={isProcessing} />
            <Form autoComplete="off" id="transaction-form">
                {/* {status?.user_activity_logs && (
                    <div
                        style={{
                            marginBottom: 16,
                            textAlign: 'end',
                        }}>
                        <LogButtonAndDialog
                            disabled={isProcessing}
                            data={status?.user_activity_logs ?? []}
                        />

                        <TextField
                            size="small"
                            disabled
                            fullWidth
                            id="uuid"
                            margin="none"
                            variant="filled"
                            label="Kode Transaksi"
                            value={status?.uuid}
                            error={Boolean(validationErrors.uuid)}
                            helperText={validationErrors.uuid}
                        />
                    </div>
                )} */}

                <FastField name="type">
                    {({ field }: FastFieldProps) => (
                        <FormControl
                            disabled={isDisabled}
                            margin="dense"
                            required>
                            <FormLabel id="type">Jenis Transaksi</FormLabel>
                            <RadioGroup
                                aria-labelledby="type"
                                row
                                {...field}
                                value={field.value ?? null}>
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
                                {/* <FormControlLabel
                                    value="transfer"
                                    control={<Radio />}
                                    label="Transfer"
                                /> */}
                            </RadioGroup>
                        </FormControl>
                    )}
                </FastField>

                <FastField name="at">
                    {({
                        field: { name, value },
                        meta: { error },
                        form,
                    }: FastFieldProps) => (
                        <DatePicker
                            disabled={isDisabled}
                            label="Tanggal"
                            onChange={value =>
                                form.setFieldValue(
                                    name,
                                    value?.format('YYYY-MM-DD') ?? '',
                                )
                            }
                            slotProps={{
                                textField: {
                                    error: Boolean(error),
                                    fullWidth: true,
                                    helperText: error,
                                    margin: 'dense',
                                    name: name,
                                    required: true,
                                    size: 'small',
                                },
                            }}
                            value={value ? dayjs(value) : null}
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
                                // to_cash_uuid,
                                // is_transaction_destination,
                            },
                            // errors,
                            // setFieldValue,
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

                                {/* {type === 'transfer' &&
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
                                    )} */}
                            </div>
                        )
                    }}
                </Field>

                {/* {values.type !== 'transfer' && (
                    <Field name="to_cash_uuid">
                        {({
                            field: { name, value, onBlur, onChange },
                            meta: { error },
                        }: FastFieldProps) => {
                            return (
                                <SelectFromApi
                                    required
                                    endpoint="/data/business-unit-cashes"
                                    label="Unit Bisnis"
                                    size="small"
                                    margin="dense"
                                    disabled={isDisabled}
                                    selectProps={{
                                        value: value,
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
                                    error={Boolean(error)}
                                    helperText={error}
                                    onChange={onChange}
                                />
                            )
                        }}
                    </Field>
                )} */}

                <Field name="transaction_tag">
                    {({
                        field: { name, value, onChange },
                        meta: { error },
                        form: {
                            values: { type },
                        },
                    }: FastFieldProps) => {
                        const categories =
                            status.businessUnit && type
                                ? getUnitTxTags(
                                      status.businessUnit,
                                      type as 'income' | 'expense',
                                  )
                                : []

                        return (
                            <FormControl
                                fullWidth
                                margin="dense"
                                required
                                size="small">
                                <InputLabel id="category-select-label">
                                    Kategori
                                </InputLabel>

                                <Select
                                    disabled={isDisabled}
                                    id="category-select"
                                    label="Kategori"
                                    labelId="category-select-label"
                                    name={name}
                                    onChange={onChange}
                                    required
                                    value={
                                        value && categories.includes(value)
                                            ? value
                                            : ''
                                    }>
                                    {categories.map(
                                        (category: string, index: number) => (
                                            <MenuItem
                                                key={index}
                                                value={category}>
                                                {category}
                                            </MenuItem>
                                        ),
                                    )}
                                </Select>

                                {error && (
                                    <FormHelperText>
                                        {error as string}
                                    </FormHelperText>
                                )}
                            </FormControl>
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
                                name={name}
                                onValueChange={({ value }) =>
                                    setFieldValue(name, value)
                                }
                                value={value}
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
                    rows={2}
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
                        {/* {values.uuid && isUserCanDelete && (
                            <Button
                                color="error"
                                onClick={() => handleDelete()}
                                loading={isDeleting}
                                disabled={isDisabled}>
                                <DeleteIcon />
                            </Button>
                        )} */}
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

type FormValues = {
    // uuid?: TransactionORM['uuid']
    cashable_uuid?: TransactionORM['cashable_uuid']
    at?: TransactionORM['at']
    amount?: TransactionORM['amount']
    desc?: TransactionORM['desc']
    type?: TransactionORM['type']
    // to_cash_uuid?: TransactionORM['to_cash_uuid']
    transaction_tag?: TransactionTag
}
