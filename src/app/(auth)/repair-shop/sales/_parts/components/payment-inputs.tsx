// vendors

// icons
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import MoneyIcon from '@mui/icons-material/Money'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'
import WorkIcon from '@mui/icons-material/Work'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { Field, type FieldProps, useFormikContext } from 'formik'
import type { JSX } from 'react'
import NumericField from '@/components/formik-fields/numeric-field'
import SelectFromApi from '@/components/Global/SelectFromApi'
import RpInputAdornment from '@/components/input-adornments/rp'
import ScrollableXBox from '@/components/scrollable-x-box'
import type SaleFormValues from '@/modules/repair-shop/types/sale-form-values'
import calculateTotals from '@/modules/repair-shop/utils/calculate-totals'
//
import type BusinessUnitCash from '@/types/orms/business-unit-cash'
// components
import type CashType from '@/types/orms/cash'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// utils
import numberToCurrency from '@/utils/number-to-currency'

interface CashOption {
    value: 'cash' | 'business-unit' | 'installment'
    label: string
    icon: JSX.Element
}

const CASH_SELECT_OPTIONS: CashOption[] = [
    {
        icon: <MoneyIcon />,
        label: 'Tunai',
        value: 'cash',
    },
    {
        icon: <WorkIcon />,
        label: 'Unit Bisnis',
        value: 'business-unit',
    },
    {
        icon: <SplitscreenIcon />,
        label: 'Angsuran',
        value: 'installment',
    },
]

export default function PaymentInput({
    name,
    label = 'Metode Pembayaran',
}: {
    name: string
    label?: string
}) {
    const { values, errors, setFieldValue, isSubmitting, status } =
        useFormikContext<SaleFormValues>()

    const isDisabled = Boolean(isSubmitting || status.isDisabled)

    return (
        <>
            <Field name={name}>
                {({
                    field: { value: selectedValue },
                    form: { errors, setFieldValue },
                }: FieldProps<'cash' | 'business-unit' | 'installment'>) => {
                    return (
                        <>
                            <Typography color="text.secondary" mb={1} mt={2}>
                                {label}*
                            </Typography>

                            <ScrollableXBox mb={3}>
                                {CASH_SELECT_OPTIONS.map(
                                    ({ value: optionValue, ...rest }) => (
                                        <Chip
                                            key={optionValue}
                                            {...rest}
                                            color={
                                                selectedValue === optionValue
                                                    ? 'success'
                                                    : 'default'
                                            }
                                            disabled={isDisabled}
                                            onClick={() => {
                                                setFieldValue(
                                                    'to_cash_uuid',
                                                    undefined,
                                                )

                                                setFieldValue(
                                                    'adjustment_rp',
                                                    0,
                                                )

                                                setFieldValue(
                                                    'cash_uuid',
                                                    undefined,
                                                )

                                                if (
                                                    optionValue ===
                                                    'business-unit'
                                                ) {
                                                    setFieldValue(
                                                        'customer_uuid',
                                                        undefined,
                                                    )
                                                }

                                                setFieldValue(name, optionValue)
                                            }}
                                            sx={{
                                                borderRadius: 10,
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                px: 2,
                                                py: 3,
                                            }}
                                        />
                                    ),
                                )}
                            </ScrollableXBox>

                            {errors.payment_method && (
                                <FormHelperText error>
                                    {errors.payment_method.toString()}
                                </FormHelperText>
                            )}
                        </>
                    )
                }}
            </Field>

            {values.payment_method === 'cash' && (
                <>
                    <RpAdjustmentField isDisabled={isDisabled} />
                    <TotalRpText />
                    <CashPicker isDisabled={isDisabled} name="cash_uuid" />
                </>
            )}

            {values.payment_method === 'business-unit' && (
                <>
                    <TotalRpText />
                    <BuCashPicker
                        isDisabled={isDisabled}
                        name="business_unit_cash_uuid"
                    />
                </>
            )}

            {values.payment_method === 'installment' && (
                <>
                    <Typography component="div" mt={2} variant="h6">
                        Rincian Potongan TBS
                    </Typography>

                    <Box display="flex" gap={1} mt={1}>
                        {/* <NumericField
                            name="installment_data.interest_percent"
                            label="Jasa"
                            disabled={isDisabled}
                            numericFormatProps={{
                                value:
                                    values.installment_data?.interest_percent ??
                                    '',
                                InputProps: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            %
                                        </InputAdornment>
                                    ),
                                },
                                ...errorsToHelperTextObj(
                                    errors.installment_data,
                                ),
                            }}
                        /> */}

                        <NumericField
                            disabled={isDisabled}
                            label="Jangka Waktu"
                            name="installment_data.n_term"
                            numericFormatProps={{
                                decimalScale: 0,
                                InputProps: {
                                    inputProps: {
                                        maxLength: 2,
                                        minLength: 1,
                                    },
                                },
                                min: 1,
                                ...errorsToHelperTextObj(
                                    errors.installment_data,
                                ),
                            }}
                        />

                        <FormControl
                            disabled={isDisabled}
                            error={Boolean(errors.installment_data)}
                            fullWidth
                            margin="dense"
                            required>
                            <InputLabel size="small">
                                Satuan Waktu Angsuran
                            </InputLabel>

                            <Select
                                label="Satuan Waktu Angsuran"
                                name="installment_data.term_unit"
                                onChange={({ target: { value } }) =>
                                    setFieldValue(
                                        'installment_data.term_unit',
                                        value,
                                    )
                                }
                                required
                                size="small"
                                value={
                                    values.installment_data?.term_unit ?? ''
                                }>
                                <MenuItem value="minggu">Minggu</MenuItem>
                                <MenuItem value="bulan">Bulan</MenuItem>
                            </Select>

                            {errors.installment_data && (
                                <FormHelperText>
                                    {errors.installment_data.toString()}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Box>

                    <TotalRpText />
                </>
            )}
        </>
    )
}

function CashPicker({
    name,
    isDisabled,
}: {
    name: string
    isDisabled: boolean
}) {
    return (
        <Field name={name}>
            {({
                field: { value },
                form: { setFieldValue },
                meta: { error },
            }: FieldProps) => {
                return (
                    <SelectFromApi
                        disabled={isDisabled}
                        endpoint="/data/cashes"
                        fullWidth
                        label="Telah dibayar ke kas"
                        margin="dense"
                        onValueChange={(value: CashType) =>
                            setFieldValue(name, value.uuid)
                        }
                        required
                        selectProps={{
                            name: name,
                            value: value ?? '',
                        }}
                        size="small"
                        {...errorsToHelperTextObj(error)}
                    />
                )
            }}
        </Field>
    )
}

function RpAdjustmentField({ isDisabled }: { isDisabled: boolean }) {
    const { setFieldValue, values } = useFormikContext<SaleFormValues>()

    const services = (values.services as SaleFormValues['services']) ?? []
    const totalServices =
        services.reduce((acc, { rp }) => acc + (rp ?? 0), 0) ?? 0

    const spareParts =
        (values.spare_parts as SaleFormValues['spare_parts']) ?? []
    const totalSparePartMovementDetails =
        spareParts.reduce(
            (acc, { rp_per_unit, qty }) =>
                acc + (rp_per_unit ?? 0) * (qty ?? 0),
            0,
        ) ?? 0

    const totalRp = totalServices + totalSparePartMovementDetails

    return (
        <NumericField
            disabled={isDisabled}
            label="Penyesuaian"
            name="adjustment_rp"
            numericFormatProps={{
                fullWidth: false,
                InputProps: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                color="warning"
                                disabled={isDisabled}
                                onClick={() =>
                                    setFieldValue(
                                        'adjustment_rp',
                                        Math.ceil(totalRp / 1000) * 1000 -
                                            totalRp,
                                    )
                                }
                                size="small">
                                <AutoFixHighIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                    startAdornment: <RpInputAdornment />,
                    sx: {
                        paddingRight: 0,
                    },
                },
                inputProps: {
                    maxLength: 3,
                    minLength: 1,
                },
                value: values.adjustment_rp ?? 0,
            }}
        />
    )
}

function TotalRpText() {
    const { values } = useFormikContext<SaleFormValues>()
    const { totalRp } = calculateTotals(values)

    return (
        <Box alignItems="center" display="flex" gap={2}>
            <Typography color="gray" component="div">
                TOTAL KESELURUHAN
            </Typography>

            <Typography
                component="div"
                fontFamily="monospace"
                sx={{
                    fontSize: '2em',
                    fontWeight: 'bold',
                }}>
                {numberToCurrency(totalRp)}
            </Typography>
        </Box>
    )
}

function BuCashPicker({
    name,
    isDisabled,
}: {
    name: string
    isDisabled: boolean
}) {
    return (
        <Field name={name}>
            {({
                field: { value },
                form: { setFieldValue },
                meta: { error },
            }: FieldProps) => {
                return (
                    <SelectFromApi
                        disabled={isDisabled}
                        endpoint="/data/business-unit-cashes"
                        label="Unit Bisnis"
                        margin="dense"
                        onValueChange={(value: CashType) =>
                            setFieldValue(name, value.uuid)
                        }
                        renderOption={(buCash: BusinessUnitCash) => (
                            <MenuItem key={buCash.uuid} value={buCash.uuid}>
                                {buCash.business_unit?.name}
                            </MenuItem>
                        )}
                        required
                        selectProps={{
                            name: name,
                            value: value ?? '',
                        }}
                        size="small"
                        {...errorsToHelperTextObj(error)}
                    />
                )
            }}
        </Field>
    )
}
