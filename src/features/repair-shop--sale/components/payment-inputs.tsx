// vendors
import type { JSX } from 'react'
import { Field, useFormikContext, type FieldProps } from 'formik'
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
// icons
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import MoneyIcon from '@mui/icons-material/Money'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'
import WorkIcon from '@mui/icons-material/Work'
// components
import type CashType from '@/dataTypes/Cash'
import type { FormData } from './sale-form-dialog'
import NumericField from '../../../components/FormikForm/NumericField/NumericField'
import RpInputAdornment from '../../../components/InputAdornment/Rp'
import SelectFromApi from '@/components/Global/SelectFromApi'
//
import type BusinessUnitCash from '@/dataTypes/BusinessUnitCash'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import ScrollableXBox from '@/components/ScrollableXBox'

interface CashOption {
    value: 'cash' | 'business-unit' | 'installment'
    label: string
    icon: JSX.Element
}

const CASH_SELECT_OPTIONS: CashOption[] = [
    {
        label: 'Tunai',
        value: 'cash',
        icon: <MoneyIcon />,
    },
    {
        label: 'Unit Bisnis',
        value: 'business-unit',
        icon: <WorkIcon />,
    },
    {
        label: 'Angsuran',
        value: 'installment',
        icon: <SplitscreenIcon />,
    },
]

export default function PaymentInput({
    name,
    label = 'Metode Pembayaran',
}: {
    name: string
    label?: string
}) {
    const { values, errors, setFieldValue, isSubmitting } =
        useFormikContext<FormData>()

    const isDisabled = Boolean(isSubmitting || values.uuid)

    return (
        <>
            <Field name={name}>
                {({
                    field: { value: selectedValue },
                    form: { errors, setFieldValue },
                }: FieldProps<'cash' | 'business-unit' | 'installment'>) => {
                    return (
                        <>
                            <Typography mb={1} mt={2} color="text.secondary">
                                {label}*
                            </Typography>

                            <ScrollableXBox mb={3}>
                                {CASH_SELECT_OPTIONS.map(
                                    ({ value: optionValue, ...rest }) => (
                                        <Chip
                                            key={optionValue}
                                            {...rest}
                                            sx={{
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                py: 3,
                                                px: 2,
                                                borderRadius: 10,
                                            }}
                                            disabled={isDisabled}
                                            color={
                                                selectedValue === optionValue
                                                    ? 'success'
                                                    : 'default'
                                            }
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

                                                setFieldValue(
                                                    'customer_uuid',
                                                    undefined,
                                                )

                                                setFieldValue(
                                                    'installment_data',
                                                    undefined,
                                                )

                                                setFieldValue(name, optionValue)
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
                    <CashPicker name="cash_uuid" isDisabled={isDisabled} />
                </>
            )}

            {values.payment_method === 'business-unit' && (
                <>
                    <TotalRpText />
                    <BuCashPicker
                        name="business_unit_cash_uuid"
                        isDisabled={isDisabled}
                    />
                </>
            )}

            {values.payment_method === 'installment' && (
                <>
                    <Typography variant="h6" component="div" mt={2}>
                        Rincian Potongan TBS
                    </Typography>

                    <Box display="flex" gap={1} mt={1}>
                        <NumericField
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
                        />

                        <NumericField
                            name="installment_data.n_term"
                            label="Jangka Waktu"
                            disabled={isDisabled}
                            numericFormatProps={{
                                min: 1,
                                decimalScale: 0,
                                value: values.installment_data?.n_term ?? '',
                                InputProps: {
                                    inputProps: {
                                        minLength: 1,
                                        maxLength: 2,
                                    },
                                },
                                ...errorsToHelperTextObj(
                                    errors.installment_data,
                                ),
                            }}
                        />

                        <FormControl
                            required
                            margin="dense"
                            // disabled={isDisabled}
                            fullWidth
                            error={Boolean(errors.installment_data)}>
                            <InputLabel size="small">
                                Satuan Waktu Angsuran
                            </InputLabel>

                            <Select
                                label="Satuan Waktu Angsuran"
                                size="small"
                                required
                                name="installment_data.term_unit"
                                value={values.installment_data?.term_unit ?? ''}
                                onChange={({ target: { value } }) =>
                                    setFieldValue(
                                        'installment_data.term_unit',
                                        value,
                                    )
                                }>
                                <MenuItem value="minggu">Minggu</MenuItem>
                                <MenuItem value="bulan">Bulan</MenuItem>
                            </Select>

                            {errors.installment_data && (
                                <FormHelperText>
                                    {errors.installment_data}
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
                        label="Telah dibayar ke kas"
                        fullWidth
                        required
                        size="small"
                        margin="dense"
                        selectProps={{
                            name: name,
                            value: value ?? '',
                        }}
                        onValueChange={(value: CashType) =>
                            setFieldValue(name, value.uuid)
                        }
                        {...errorsToHelperTextObj(error)}
                    />
                )
            }}
        </Field>
    )
}

function RpAdjustmentField({ isDisabled }: { isDisabled: boolean }) {
    const { setFieldValue, values } = useFormikContext<FormData>()

    const services = (values.services as FormData['services']) ?? []
    const totalServices =
        services.reduce((acc, { rp }) => acc + (rp ?? 0), 0) ?? 0

    const spareParts = (values.spare_parts as FormData['spare_parts']) ?? []
    const totalSparePartMovementDetails =
        spareParts.reduce(
            (acc, { rp_per_unit, qty }) =>
                acc + (rp_per_unit ?? 0) * (qty ?? 0),
            0,
        ) ?? 0

    const totalRp = totalServices + totalSparePartMovementDetails

    return (
        <NumericField
            name="adjustment_rp"
            disabled={isDisabled}
            label="Penyesuaian"
            numericFormatProps={{
                fullWidth: false,
                value: values.adjustment_rp ?? 0,
                InputProps: {
                    startAdornment: <RpInputAdornment />,
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                color="warning"
                                disabled={isDisabled}
                                onClick={() =>
                                    setFieldValue(
                                        'adjustment_rp',
                                        Math.ceil(totalRp / 1000) * 1000 -
                                            totalRp,
                                    )
                                }>
                                <AutoFixHighIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                    sx: {
                        paddingRight: 0,
                    },
                },
                inputProps: {
                    minLength: 1,
                    maxLength: 3,
                },
            }}
        />
    )
}

function TotalRpText() {
    const { values } = useFormikContext<FormData>()

    const totalMovementRp =
        values.spare_parts?.reduce(
            (acc, { rp_per_unit, qty }) =>
                acc + (rp_per_unit ?? 0) * (qty ?? 0),
            0,
        ) ?? 0

    const totalServiceRp =
        values.services?.reduce((acc, { rp }) => acc + (rp ?? 0), 0) ?? 0

    const totalRpWithoutInterest =
        totalMovementRp + totalServiceRp + (values.adjustment_rp ?? 0)

    const totalRp =
        totalRpWithoutInterest +
        Math.ceil(
            totalRpWithoutInterest *
                ((values.installment_data?.interest_percent ?? 0) / 100),
        ) *
            (values.installment_data?.n_term ?? 0)

    return (
        <Box display="flex" gap={2} alignItems="center">
            <Typography component="div" color="gray">
                TOTAL KESELURUHAN
            </Typography>

            <Typography
                component="div"
                fontFamily="monospace"
                sx={{
                    fontWeight: 'bold',
                    fontSize: '2em',
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
                        required
                        disabled={isDisabled}
                        endpoint="/data/business-unit-cashes"
                        label="Unit Bisnis"
                        size="small"
                        margin="dense"
                        selectProps={{
                            value: value ?? '',
                            name: name,
                        }}
                        renderOption={(buCash: BusinessUnitCash) => (
                            <MenuItem key={buCash.uuid} value={buCash.uuid}>
                                {buCash.business_unit?.name}
                            </MenuItem>
                        )}
                        onValueChange={(value: CashType) =>
                            setFieldValue(name, value.uuid)
                        }
                        {...errorsToHelperTextObj(error)}
                    />
                )
            }}
        </Field>
    )
}
