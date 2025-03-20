// types
import type CashType from '@/dataTypes/Cash'
import type { UUID } from 'crypto'
import type ProductType from '@/dataTypes/Product'
import type { ProductSale } from '@/dataTypes/ProductSale'
import type User from '@/features/user/types/user'
import type Wallet from '@/dataTypes/Wallet'
// vendors
import { FastField, type FormikProps } from 'formik'
import { memo, useState } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
// components
import CrediturCard from '../user-loans/CrediturCard'
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/FormikForm'
import LoadingAddorment from '@/components/LoadingAddorment'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import ProductSaleDetailArrayField from './Form/ProductSaleDetailArrayField'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import UserAutocomplete from '@/components/UserAutocomplete'
// icons
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import numberToCurrency from '@/utils/numberToCurrency'
import useAuth from '@/providers/Auth'
import UserActivityLogs from '@/components/UserActivityLogs'
import TextField from '@/components/TextField'
// enums
import Role from '@/enums/Role'
import type ProductMovement from '@/dataTypes/ProductMovement'
import Warehouse from '@/enums/Warehouse'

const ProductSaleForm = memo(function ProductSaleForm({
    dirty,
    errors,
    isSubmitting,
    values: {
        at,
        payment_method,
        n_term_unit,
        n_term,
        adjustment_rp,
        product_sale_details,
        cashable_uuid,
        interest_percent,
        warehouse,
    },
    status,
    setFieldValue,
}: FormikProps<typeof EMPTY_FORM_DATA>) {
    const typedStatus: null | ProductSale = status
    const { uuid, buyer_user, short_uuid, is_paid } = typedStatus ?? {}

    const [userAutocompleteValue, setUserAutocompleteValue] =
        useState<User | null>(buyer_user ?? null)

    const { userHasRole } = useAuth()

    const totalRp =
        product_sale_details?.reduce(
            (acc, { qty, rp_per_unit }) =>
                acc + Math.abs(qty ?? 0) * (rp_per_unit ?? 0),
            0,
        ) ?? 0

    const { data: wallet, isLoading: isWalletLoading } = useSWR<Wallet>(
        userAutocompleteValue?.uuid && !is_paid
            ? `/wallets/user/${userAutocompleteValue?.uuid}`
            : null,
    )

    const isNew = !uuid
    const isPropcessing = isSubmitting
    const isDisabled = isPropcessing || !isNew
    const isBalanceEnough = (wallet?.balance ?? 0) >= totalRp
    const isNeedToDetermineWarehouse =
        userHasRole(Role.FARM_INPUT_SALES_MUAI_WAREHOUSE) ===
        userHasRole(Role.FARM_INPUT_SALES_PULAU_PINANG_WAREHOUSE)

    const warehouseAuto = isNeedToDetermineWarehouse
        ? undefined
        : userHasRole(Role.FARM_INPUT_SALES_MUAI_WAREHOUSE)
          ? Warehouse.MUAI
          : Warehouse.PULAU_PINANG

    if (!isBalanceEnough && payment_method === 'wallet' && isNew) {
        setFieldValue('payment_method', null)
    }

    return (
        <FormikForm
            id="product-sale-form"
            autoComplete="off"
            isNew={false}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            {!isNew && (
                <Grid container spacing={1}>
                    <Grid item xs={6} sm={9}>
                        <TextField
                            disabled
                            label="UUID"
                            variant="filled"
                            value={uuid}
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            disabled
                            label="Kode"
                            variant="filled"
                            value={short_uuid}
                        />
                    </Grid>
                </Grid>
            )}

            <Fade in={isNeedToDetermineWarehouse} unmountOnExit>
                <FormControl size="small" disabled={isDisabled}>
                    <FormLabel id="gudang-buttons-group-label">
                        Gudang
                    </FormLabel>

                    <ToggleButtonGroup
                        disabled={isDisabled}
                        aria-labelledby="gudang-buttons-group-label"
                        color="primary"
                        value={warehouse}
                        exclusive
                        size="small"
                        onChange={(_, value) =>
                            setFieldValue('warehouse', value)
                        }>
                        {Object.values(Warehouse).map((warehouse, i) => (
                            <ToggleButton key={i} value={warehouse}>
                                {warehouse}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <FormHelperText error>{errors?.warehouse}</FormHelperText>
                </FormControl>
            </Fade>

            <Grid container columnSpacing={1.5}>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        value={at ? dayjs(at) : null}
                        disabled={isDisabled}
                        maxDate={dayjs().add(1, 'day')}
                        label="Tanggal"
                        onChange={date =>
                            setFieldValue('at', date?.format('YYYY-MM-DD'))
                        }
                        slotProps={{
                            textField: {
                                name: 'at',
                                ...errorsToHelperTextObj(errors.at),
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <UserAutocomplete
                        showNickname
                        label="Pengguna"
                        disabled={isDisabled}
                        fullWidth
                        onChange={(_, user) => {
                            setUserAutocompleteValue(user)
                            setFieldValue('buyer_user_uuid', user?.uuid)
                        }}
                        value={userAutocompleteValue}
                        size="small"
                        textFieldProps={{
                            required: ['installment', 'wallet'].includes(
                                payment_method ?? '',
                            ),
                            margin: 'dense',
                            ...errorsToHelperTextObj(errors.buyer_user_uuid),
                        }}
                    />
                </Grid>
            </Grid>

            <FastField
                name="note"
                component={TextFieldFastableComponent}
                required={false}
                multiline
                disabled={isDisabled}
                rows={2}
                label="Catatan"
                {...errorsToHelperTextObj(errors.note)}
            />

            <ProductSaleDetailArrayField
                warehouse={warehouse ?? warehouseAuto}
                errors={errors}
                data={product_sale_details}
                disabled={isDisabled}
            />

            <FormControl
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                margin="normal"
                required
                size="small"
                disabled={isDisabled}
                error={Boolean(errors.payment_method)}>
                <FormLabel id="payment_method">Metode Pembayaran</FormLabel>

                <RadioGroup
                    row
                    aria-labelledby="payment_method"
                    name="payment_method"
                    value={payment_method}
                    onChange={({ target: { value } }) =>
                        setFieldValue('payment_method', value)
                    }>
                    <FormControlLabel
                        value="cash"
                        control={<Radio required size="small" />}
                        label="Tunai"
                    />

                    <div>
                        <FormControlLabel
                            value="wallet"
                            control={
                                <Radio
                                    size="small"
                                    disabled={
                                        !userAutocompleteValue?.uuid ||
                                        !wallet ||
                                        !isBalanceEnough ||
                                        isDisabled
                                    }
                                />
                            }
                            label={
                                <>
                                    <span>Wallet</span>

                                    {isWalletLoading && (
                                        <div style={{ marginTop: '.7rem' }}>
                                            <LoadingAddorment show={true} />
                                        </div>
                                    )}

                                    {userAutocompleteValue?.uuid &&
                                        !is_paid && (
                                            <Typography
                                                variant="caption"
                                                component="div"
                                                color={
                                                    isBalanceEnough
                                                        ? undefined
                                                        : 'error.main'
                                                }>
                                                {wallet?.balance
                                                    ? numberToCurrency(
                                                          wallet.balance,
                                                      )
                                                    : ''}
                                            </Typography>
                                        )}
                                </>
                            }
                        />
                    </div>

                    <FormControlLabel
                        value="installment"
                        control={
                            <Radio
                                size="small"
                                disabled={
                                    !userAutocompleteValue?.uuid || isDisabled
                                }
                            />
                        }
                        label="Potong TBS"
                    />
                </RadioGroup>

                {errors.payment_method && (
                    <FormHelperText>{errors.payment_method}</FormHelperText>
                )}
            </FormControl>

            {payment_method === 'installment' && (
                <>
                    {userAutocompleteValue?.uuid && !is_paid && (
                        <CrediturCard data={userAutocompleteValue} />
                    )}

                    <Typography variant="h6" component="div" mt={2}>
                        Rincian Potongan TBS
                    </Typography>

                    <Box display="flex" gap={1} mt={1}>
                        <NumericFormat
                            label="Jasa"
                            disabled={isDisabled}
                            value={interest_percent}
                            name="interest_percent"
                            onValueChange={({ floatValue }) =>
                                debounce(() =>
                                    setFieldValue(
                                        'interest_percent',
                                        floatValue,
                                    ),
                                )
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        %
                                    </InputAdornment>
                                ),
                            }}
                            {...errorsToHelperTextObj(errors.interest_percent)}
                        />

                        <NumericFormat
                            label="Jangka Waktu"
                            disabled={isDisabled}
                            decimalScale={0}
                            min={1}
                            value={n_term}
                            name="n_term"
                            onValueChange={({ floatValue }) =>
                                debounce(() =>
                                    setFieldValue('n_term', floatValue),
                                )
                            }
                            inputProps={{
                                minLength: 1,
                                maxLength: 2,
                            }}
                            {...errorsToHelperTextObj(errors.n_term)}
                        />

                        <FormControl
                            required
                            margin="dense"
                            disabled={isDisabled}
                            fullWidth
                            error={Boolean(errors.n_term_unit)}>
                            <InputLabel size="small">
                                Satuan Waktu Angsuran
                            </InputLabel>

                            <Select
                                label="Satuan Waktu Angsuran"
                                size="small"
                                required
                                name="n_term_unit"
                                value={n_term_unit}
                                onChange={({ target: { value } }) =>
                                    setFieldValue('n_term_unit', value)
                                }>
                                <MenuItem value="minggu">Minggu</MenuItem>
                                <MenuItem value="bulan">Bulan</MenuItem>
                            </Select>
                            {errors.n_term_unit && (
                                <FormHelperText>
                                    {errors.n_term_unit}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Box>

                    <Box
                        display="flex"
                        gap={1.5}
                        alignItems="flex-end"
                        justifyContent="end">
                        <Typography
                            variant="h6"
                            component="span"
                            color="gray"
                            fontWeight="bold">
                            TOTAL KESELURUHAN
                        </Typography>

                        <Typography variant="h6" component="span">
                            {numberToCurrency(
                                totalRp +
                                    Math.ceil(
                                        totalRp *
                                            ((interest_percent ?? 0) / 100),
                                    ) *
                                        (n_term ?? 0),
                            )}
                        </Typography>
                    </Box>
                </>
            )}

            {payment_method === 'cash' && (
                <>
                    <Grid container mt={1} spacing={1.5} alignItems="end">
                        <Grid item xs={9} textAlign="end">
                            <Typography
                                variant="h6"
                                component="div"
                                color="gray"
                                fontWeight="bold">
                                TOTAL KESELURUHAN
                            </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <NumericFormat
                                label="Penyesuaian"
                                allowNegative
                                disabled={isDisabled}
                                decimalScale={0}
                                value={adjustment_rp}
                                name="adjustment_rp"
                                onValueChange={({ floatValue }) =>
                                    debounce(() =>
                                        setFieldValue(
                                            'adjustment_rp',
                                            floatValue,
                                        ),
                                    )
                                }
                                InputProps={{
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
                                                        Math.ceil(
                                                            totalRp / 1000,
                                                        ) *
                                                            1000 -
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
                                }}
                                inputProps={{
                                    minLength: 1,
                                    maxLength: 3,
                                }}
                                {...errorsToHelperTextObj(errors.adjustment_rp)}
                            />

                            <Typography variant="h6" component="div">
                                {numberToCurrency(
                                    totalRp + (adjustment_rp ?? 0),
                                )}
                            </Typography>
                        </Grid>
                    </Grid>

                    <div
                        style={{
                            marginTop: '1rem',
                            marginBottom: '1rem',
                        }}>
                        <SelectFromApi
                            required
                            endpoint="/data/cashes"
                            label="Telah Dibayar Ke Kas"
                            size="small"
                            margin="dense"
                            disabled={isDisabled}
                            selectProps={{
                                value: cashable_uuid,
                                name: 'cashable_uuid',
                            }}
                            onValueChange={({ uuid }: CashType) =>
                                setFieldValue('cashable_uuid', uuid)
                            }
                            {...errorsToHelperTextObj(errors.cashable_uuid)}
                        />
                    </div>
                </>
            )}

            {userHasRole(Role.FARM_INPUT_MANAGER) && !isNew && (
                <UserActivityLogs
                    data={typedStatus?.user_activity_logs ?? []}
                />
            )}
        </FormikForm>
    )
})

export default ProductSaleForm

export const EMPTY_FORM_DATA: Partial<{
    buyer_user_uuid: null | ProductSale['buyer_user_uuid']
    at: null | ProductSale['at']
    note: '' | ProductSale['note']
    warehouse: ProductMovement['warehouse']

    product_sale_details: {
        product_id: null | number
        product: null | ProductType
        qty?: number
        rp_per_unit?: number
    }[]

    // payment
    payment_method: null | 'cash' | 'installment' | 'wallet'
    cashable_uuid: '' | UUID

    adjustment_rp?: number

    // payment installment
    interest_percent: ProductSale['interest_percent']
    n_term: ProductSale['n_term']
    n_term_unit: null | ProductSale['n_term_unit']
}> = {
    buyer_user_uuid: null,
    note: '',
    product_sale_details: [
        {
            product_id: null,
            product: null,
        },
    ],

    payment_method: null,
    cashable_uuid: '',
}

export const EMPTY_FORM_STATUS: null | ProductSale = null
