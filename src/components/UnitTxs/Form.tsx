// types
import type { Transaction } from '@/dataTypes/Transaction'
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
// icons
// import DeleteIcon from '@mui/icons-material/Delete'
// components
import DatePicker from '@/components/DatePicker'
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
import FormLoadingBar from '@/components/Dialog/LoadingBar'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// import UserActivityLogsDialogTable from '@/components/UserActivityLogs/DialogTable'
// providers
// import useAuth from '@/providers/Auth'
// utils
// import errorCatcher from '@/utils/errorCatcher'
import TransactionTag from '@/enums/TransactionTag'
import getUnitTxTags from '@/utils/getUnitTxTags'
import BusinessUnit from '@/enums/BusinessUnit'

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

    // const { userHasPermission } = useAuth()
    // const isUserCanDelete = userHasPermission('transactions delete')

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
                            margin="dense"
                            required
                            disabled={isDisabled}>
                            <FormLabel id="type">Jenis Transaksi</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="type"
                                {...field}
                                value={field.value ?? null}>
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
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    margin: 'dense',
                                    size: 'small',
                                    error: Boolean(error),
                                    helperText: error,
                                    name: name,
                                },
                            }}
                            value={value ? dayjs(value) : null}
                            label="Tanggal"
                            disabled={isDisabled}
                            onChange={value =>
                                form.setFieldValue(
                                    name,
                                    value?.format('YYYY-MM-DD') ?? '',
                                )
                            }
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
                                size="small"
                                margin="dense"
                                required>
                                <InputLabel id="category-select-label">
                                    Kategori
                                </InputLabel>

                                <Select
                                    labelId="category-select-label"
                                    id="category-select"
                                    required
                                    disabled={isDisabled}
                                    value={
                                        value && categories.includes(value)
                                            ? value
                                            : ''
                                    }
                                    label="Kategori"
                                    name={name}
                                    onChange={onChange}>
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

type FormValues = {
    // uuid?: Transaction['uuid']
    cashable_uuid?: Transaction['cashable_uuid']
    at?: Transaction['at']
    amount?: Transaction['amount']
    desc?: Transaction['desc']
    type?: Transaction['type']
    // to_cash_uuid?: Transaction['to_cash_uuid']
    transaction_tag?: TransactionTag
}
