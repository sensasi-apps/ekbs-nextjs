import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import Chip from '@mui/material/Chip'
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
import type { UUID } from 'crypto'
import dayjs from 'dayjs'
import type { FormikErrors, FormikProps } from 'formik'
import DatePicker from '@/components/date-picker'
import FormikForm from '@/components/formik-form'
import IconButton from '@/components/icon-button'
import InfoBox from '@/components/info-box'
import NumericFormat from '@/components/numeric-format'
import type CashType from '@/types/orms/cash'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import getInstallmentType from '@/utils/get-installment-type'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'
import SelectFromApi from '../Global/SelectFromApi'
import RpInputAdornment from '../input-adornments/rp'
import type ApiResponseItem from './types/api-response-item'

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
}: Omit<FormikProps<FormValuesType>, 'status'> & { status?: ApiResponseItem }) {
    const {
        amount_rp,
        should_be_paid_at,
        transaction,
        user_name,
        user_id,
        at: installmentCreatedAt,
    } = status ?? {}

    const isNew = false
    const isPropcessing = isSubmitting
    const isDisabled = isPropcessing || Boolean(transaction)

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="product-opname-form"
            isNew={isNew}
            processing={isPropcessing}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            <InfoBox
                data={[
                    {
                        label: 'Nama',
                        value: status && (
                            <>
                                <Chip
                                    color="info"
                                    label={user_id}
                                    size="small"
                                    sx={{
                                        fontSize: '0.75rem',
                                        mr: 1,
                                    }}
                                    variant="outlined"
                                />

                                {user_name}
                            </>
                        ),
                    },
                    {
                        label: 'Jenis',
                        value: status && getInstallmentType(status),
                    },
                    {
                        label: 'Tanggal Transaksi',
                        value:
                            installmentCreatedAt && toDmy(installmentCreatedAt),
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

            <Stack gap={2} mt={4}>
                <PaymentSection
                    disabled={isDisabled}
                    errors={errors}
                    payment_method={payment_method}
                    setFieldValue={setFieldValue}
                />

                <DatePicker
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
                    value={at ? dayjs(at) : null}
                />

                {payment_method === 'cash' && (
                    <CashPayment
                        adjustment_rp={adjustment_rp}
                        cashable_uuid={cashable_uuid}
                        disabled={isDisabled}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        totalRp={amount_rp ?? 0}
                    />
                )}
            </Stack>
        </FormikForm>
    )
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
                disabled={disabled}
                error={Boolean(errors.payment_method)}
                margin="none"
                required
                size="small"
                style={{
                    alignItems: 'center',
                    display: 'flex',
                }}>
                <FormLabel id="payment_method">Metode Pembayaran</FormLabel>

                <RadioGroup
                    aria-labelledby="payment_method"
                    name="payment_method"
                    onChange={({ target: { value } }) =>
                        setFieldValue('payment_method', value)
                    }
                    row
                    value={payment_method ?? null}>
                    <FormControlLabel
                        control={<Radio required size="small" />}
                        label="Tunai"
                        value="cash"
                    />

                    <FormControlLabel
                        control={
                            <Radio
                                disabled={
                                    true
                                    // !userAutocompleteValue?.uuid ||
                                    // !wallet ||
                                    // !isBalanceEnough ||
                                    // isDisabled
                                }
                                size="small"
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
                        value="wallet"
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
            <Grid alignItems="end" container spacing={1.5}>
                <Grid item textAlign="end" xs={6}>
                    <Typography color="gray" component="div" fontWeight="bold">
                        TOTAL KESELURUHAN
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <NumericFormat
                        allowNegative
                        decimalScale={0}
                        disabled={disabled}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        color="warning"
                                        disabled={disabled}
                                        icon={AutoFixHighIcon}
                                        onClick={() =>
                                            setFieldValue(
                                                'adjustment_rp',
                                                Math.ceil(totalRp / 1000) *
                                                    1000 -
                                                    totalRp,
                                            )
                                        }
                                        size="small"
                                        title="Penyesuaian Otomatis"
                                    />
                                </InputAdornment>
                            ),
                            startAdornment: <RpInputAdornment />,
                            sx: {
                                paddingRight: 0,
                            },
                        }}
                        inputProps={{
                            maxLength: 3,
                            minLength: 1,
                        }}
                        label="Penyesuaian"
                        name="adjustment_rp"
                        onValueChange={({ floatValue }) =>
                            setFieldValue('adjustment_rp', floatValue)
                        }
                        value={adjustment_rp}
                        {...errorsToHelperTextObj(errors.adjustment_rp)}
                    />

                    <Typography component="div" variant="h6">
                        {numberToCurrency(totalRp + (adjustment_rp ?? 0))}
                    </Typography>
                </Grid>
            </Grid>

            <SelectFromApi
                disabled={disabled}
                endpoint="/data/cashes"
                label="Telah Dibayar Ke Kas"
                onValueChange={({ uuid }: CashType) =>
                    setFieldValue('cashable_uuid', uuid)
                }
                required
                selectProps={{
                    name: 'cashable_uuid',
                    value: cashable_uuid ?? '',
                }}
                size="small"
                {...errorsToHelperTextObj(errors.cashable_uuid)}
            />
        </>
    )
}
