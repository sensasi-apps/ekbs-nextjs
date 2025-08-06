// types
import type { FormikErrors, FormikProps } from 'formik'
import type { UUID } from 'crypto'
import type { Installment } from '@/dataTypes/Installment'
import type CashType from '@/dataTypes/Cash'
// vendors
import dayjs from 'dayjs'
// materials
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/GridLegacy'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
// icons
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
// components
import FormikForm from '@/components/FormikForm'
import DatePicker from '@/components/DatePicker'
import InfoBox from '../InfoBox'
import SelectFromApi from '../Global/SelectFromApi'
import IconButton from '../IconButton'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import getInstallmentType from '@/utils/getInstallmentType'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'
import NumericFormat from '../NumericFormat'
import RpInputAdornment from '../InputAdornment/Rp'

export type FormValuesType = {
    at?: string
    payment_method?: 'cash' | 'wallet'
    cashable_uuid?: UUID
    adjustment_rp?: number
}

export default function ReceivablePaymentForm({
    dirty,
    errors,
    isSubmitting,
    values: { at, payment_method, cashable_uuid, adjustment_rp },
    status,
    setFieldValue,
}: Omit<FormikProps<FormValuesType>, 'status'> & { status?: Installment }) {
    const {
        amount_rp,
        should_be_paid_at,
        user_loan,
        rent_item_rent,
        product_sale,
        transaction,
    } = status ?? {}
    const txDate =
        user_loan?.proposed_at ??
        product_sale?.at ??
        rent_item_rent?.finished_at
    // TODO: replace any with the correct type
    const isNew = false
    const isPropcessing = isSubmitting
    const isDisabled = isPropcessing || Boolean(transaction)

    return (
        <FormikForm
            id="product-opname-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            <InfoBox
                data={[
                    {
                        label: 'Nama',
                        value: status && getUserNameFromInstallmentable(status),
                    },
                    {
                        label: 'Jenis',
                        value: status && getInstallmentType(status),
                    },
                    {
                        label: 'Tanggal Transaksi',
                        value: txDate && toDmy(txDate),
                    },
                    {
                        label: 'Jatuh Tempo',
                        value: should_be_paid_at && toDmy(should_be_paid_at),
                    },
                    {
                        label: 'Jumlah',
                        value: amount_rp && numberToCurrency(amount_rp),
                    },
                ]}
            />

            <Stack mt={4} gap={2}>
                <PaymentSection
                    disabled={isDisabled}
                    errors={errors}
                    payment_method={payment_method}
                    setFieldValue={setFieldValue}
                />

                <DatePicker
                    value={at ? dayjs(at) : null}
                    disabled={isDisabled}
                    label="Tanggal Pelunasan"
                    onChange={date =>
                        setFieldValue('at', date?.format('YYYY-MM-DD'))
                    }
                    slotProps={{
                        textField: {
                            margin: 'none',
                            name: 'at',
                            ...errorsToHelperTextObj(errors.at),
                        },
                    }}
                />

                {payment_method === 'cash' && (
                    <CashPayment
                        disabled={isDisabled}
                        errors={errors}
                        cashable_uuid={cashable_uuid}
                        setFieldValue={setFieldValue}
                        totalRp={amount_rp ?? 0}
                        adjustment_rp={adjustment_rp}
                    />
                )}
            </Stack>
        </FormikForm>
    )
}

function getUserNameFromInstallmentable(data: Installment) {
    switch (data.installmentable_classname) {
        case 'App\\Models\\ProductSale':
            return data.product_sale?.buyer_user?.name

        case 'App\\Models\\UserLoan':
            return data.user_loan?.user?.name

        case 'App\\Models\\RentItemRent':
            return data.rent_item_rent?.by_user?.name

        default:
            break
    }
}

function PaymentSection({
    disabled,
    errors,
    payment_method,
    setFieldValue,
}: {
    disabled: boolean
    errors: FormikErrors<FormValuesType>
    payment_method: 'cash' | undefined | 'wallet'
    setFieldValue: FormikProps<FormValuesType>['setFieldValue']
}) {
    return (
        <>
            <FormControl
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                margin="none"
                required
                size="small"
                disabled={disabled}
                error={Boolean(errors.payment_method)}>
                <FormLabel id="payment_method">Metode Pembayaran</FormLabel>

                <RadioGroup
                    row
                    aria-labelledby="payment_method"
                    name="payment_method"
                    value={payment_method ?? null}
                    onChange={({ target: { value } }) =>
                        setFieldValue('payment_method', value)
                    }>
                    <FormControlLabel
                        value="cash"
                        control={<Radio required size="small" />}
                        label="Tunai"
                    />

                    <FormControlLabel
                        value="wallet"
                        control={
                            <Radio
                                size="small"
                                disabled={
                                    true
                                    // !userAutocompleteValue?.uuid ||
                                    // !wallet ||
                                    // !isBalanceEnough ||
                                    // isDisabled
                                }
                            />
                        }
                        label={
                            <>
                                <span>Wallet</span>

                                {/* {isWalletLoading && (
                                    <div style={{ marginTop: '.7rem' }}>
                                        <LoadingAddorment show={true} />
                                    </div>
                                )} */}

                                {/* {userAutocompleteValue?.uuid && !is_paid && (
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color={
                                            isBalanceEnough
                                                ? undefined
                                                : 'error.main'
                                        }>
                                        {wallet?.balance
                                            ? numberToCurrency(wallet.balance)
                                            : ''}
                                    </Typography>
                                )} */}
                            </>
                        }
                    />
                </RadioGroup>

                {errors.payment_method && (
                    <FormHelperText>{errors.payment_method}</FormHelperText>
                )}
            </FormControl>
        </>
    )
}

function CashPayment({
    disabled,
    errors,
    cashable_uuid,
    totalRp,
    adjustment_rp,
    setFieldValue,
}: {
    disabled: boolean
    errors: FormikErrors<FormValuesType>
    cashable_uuid: UUID | undefined
    totalRp: number
    adjustment_rp: number | undefined
    setFieldValue: FormikProps<FormValuesType>['setFieldValue']
}) {
    return (
        <>
            <Grid container spacing={1.5} alignItems="end">
                <Grid item xs={6} textAlign="end">
                    <Typography component="div" color="gray" fontWeight="bold">
                        TOTAL KESELURUHAN
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <NumericFormat
                        label="Penyesuaian"
                        allowNegative
                        disabled={disabled}
                        decimalScale={0}
                        value={adjustment_rp}
                        name="adjustment_rp"
                        onValueChange={({ floatValue }) =>
                            setFieldValue('adjustment_rp', floatValue)
                        }
                        InputProps={{
                            startAdornment: <RpInputAdornment />,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        title="Penyesuaian Otomatis"
                                        icon={AutoFixHighIcon}
                                        size="small"
                                        color="warning"
                                        disabled={disabled}
                                        onClick={() =>
                                            setFieldValue(
                                                'adjustment_rp',
                                                Math.ceil(totalRp / 1000) *
                                                    1000 -
                                                    totalRp,
                                            )
                                        }
                                    />
                                </InputAdornment>
                            ),
                            sx: {
                                paddingRight: 0,
                            },
                        }}
                        inputProps={{
                            minLength: 1,
                            maxLength: 3,
                        }}
                        {...errorsToHelperTextObj(errors.adjustment_rp)}
                    />

                    <Typography variant="h6" component="div">
                        {numberToCurrency(totalRp + (adjustment_rp ?? 0))}
                    </Typography>
                </Grid>
            </Grid>

            <SelectFromApi
                required
                endpoint="/data/cashes"
                label="Telah Dibayar Ke Kas"
                size="small"
                disabled={disabled}
                selectProps={{
                    value: cashable_uuid ?? '',
                    name: 'cashable_uuid',
                }}
                onValueChange={({ uuid }: CashType) =>
                    setFieldValue('cashable_uuid', uuid)
                }
                {...errorsToHelperTextObj(errors.cashable_uuid)}
            />
        </>
    )
}
