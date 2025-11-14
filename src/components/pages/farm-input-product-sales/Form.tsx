// types

// icons
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
// materials
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/GridLegacy'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import type { UUID } from 'crypto'
import dayjs from 'dayjs'
// vendors
import { FastField, type FormikProps } from 'formik'
import { memo, useState } from 'react'
import useSWR from 'swr'
import DatePicker from '@/components/date-picker'
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import LoadingAdornment from '@/components/input-adornments/loading'
import RpInputAdornment from '@/components/input-adornments/rp'
import NumericFormat from '@/components/numeric-format'
import TextField from '@/components/text-field'
import TextFieldFastableComponent from '@/components/text-field.fastable-component'
import UserActivityLogs from '@/components/UserActivityLogs'
import UserAutocomplete from '@/components/user-autocomplete'
import Role from '@/enums/role'
// hooks
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import Warehouse from '@/modules/farm-inputs/enums/warehouse'
import type ProductType from '@/modules/farm-inputs/types/orms/product'
// enums
import type ProductMovement from '@/modules/farm-inputs/types/orms/product-movement'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
// modules
import type MinimalUser from '@/modules/user/types/minimal-user'
import type CashType from '@/types/orms/cash'
import type Wallet from '@/types/orms/wallet'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'
// components
import CreditorCard from '../user-loans/creditor-card'
import ProductSaleDetailArrayField from './Form/ProductSaleDetailArrayField'

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
    const typedStatus: null | ProductSaleORM = status
    const { uuid, buyer_user, short_uuid, is_paid } = typedStatus ?? {}

    const [userAutocompleteValue, setUserAutocompleteValue] =
        useState<MinimalUser | null>(buyer_user ?? null)

    const isAuthHasRole = useIsAuthHasRole()

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
        isAuthHasRole(Role.FARM_INPUT_SALES_MUAI_WAREHOUSE) ===
        isAuthHasRole(Role.FARM_INPUT_SALES_PULAU_PINANG_WAREHOUSE)

    const warehouseAuto = isNeedToDetermineWarehouse
        ? undefined
        : isAuthHasRole(Role.FARM_INPUT_SALES_MUAI_WAREHOUSE)
          ? Warehouse.MUAI
          : Warehouse.PULAU_PINANG

    if (!isBalanceEnough && payment_method === 'wallet' && isNew) {
        setFieldValue('payment_method', null)
    }

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="product-sale-form"
            isNew={false}
            processing={isPropcessing}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            {!isNew && (
                <Grid container spacing={1}>
                    <Grid item sm={9} xs={6}>
                        <TextField
                            disabled
                            label="UUID"
                            value={uuid}
                            variant="filled"
                        />
                    </Grid>

                    <Grid item sm={3} xs={6}>
                        <TextField
                            disabled
                            label="Kode"
                            value={short_uuid}
                            variant="filled"
                        />
                    </Grid>
                </Grid>
            )}

            <Fade in={isNeedToDetermineWarehouse} unmountOnExit>
                <FormControl disabled={isDisabled} size="small">
                    <FormLabel id="gudang-buttons-group-label">
                        Gudang
                    </FormLabel>

                    <ToggleButtonGroup
                        aria-labelledby="gudang-buttons-group-label"
                        color="primary"
                        disabled={isDisabled}
                        exclusive
                        onChange={(_, value) =>
                            setFieldValue('warehouse', value)
                        }
                        size="small"
                        value={warehouse}>
                        {Object.values(Warehouse).map(warehouse => (
                            <ToggleButton key={warehouse} value={warehouse}>
                                {warehouse}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <FormHelperText error>{errors?.warehouse}</FormHelperText>
                </FormControl>
            </Fade>

            <Grid columnSpacing={1.5} container>
                <Grid item sm={6} xs={12}>
                    <DatePicker
                        disabled={isDisabled}
                        label="Tanggal"
                        maxDate={dayjs().add(1, 'day')}
                        onChange={date =>
                            setFieldValue('at', date?.format('YYYY-MM-DD'))
                        }
                        slotProps={{
                            textField: {
                                name: 'at',
                                ...errorsToHelperTextObj(errors.at),
                            },
                        }}
                        value={at ? dayjs(at) : null}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <UserAutocomplete
                        disabled={isDisabled}
                        fullWidth
                        label="Pengguna"
                        onChange={(_, user) => {
                            setUserAutocompleteValue(user)
                            setFieldValue('buyer_user_uuid', user?.uuid)
                        }}
                        size="small"
                        slotProps={{
                            textField: {
                                margin: 'dense',
                                required: ['installment', 'wallet'].includes(
                                    payment_method ?? '',
                                ),
                                ...errorsToHelperTextObj(
                                    errors.buyer_user_uuid,
                                ),
                            },
                        }}
                        value={userAutocompleteValue}
                    />
                </Grid>
            </Grid>

            <FastField
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Catatan"
                multiline
                name="note"
                required={false}
                rows={2}
                {...errorsToHelperTextObj(errors.note)}
            />

            <ProductSaleDetailArrayField
                data={product_sale_details}
                disabled={isDisabled}
                errors={errors}
                warehouse={warehouse ?? warehouseAuto}
            />

            <FormControl
                disabled={isDisabled}
                error={Boolean(errors.payment_method)}
                margin="normal"
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
                    value={payment_method}>
                    <FormControlLabel
                        control={<Radio required size="small" />}
                        label="Tunai"
                        value="cash"
                    />

                    <div>
                        <FormControlLabel
                            control={
                                <Radio
                                    disabled={
                                        !userAutocompleteValue?.uuid ||
                                        !wallet ||
                                        !isBalanceEnough ||
                                        isDisabled
                                    }
                                    size="small"
                                />
                            }
                            label={
                                <>
                                    <span>Wallet</span>

                                    {isWalletLoading && (
                                        <div style={{ marginTop: '.7rem' }}>
                                            <LoadingAdornment show />
                                        </div>
                                    )}

                                    {userAutocompleteValue?.uuid &&
                                        !is_paid && (
                                            <Typography
                                                color={
                                                    isBalanceEnough
                                                        ? undefined
                                                        : 'error.main'
                                                }
                                                component="div"
                                                variant="caption">
                                                {wallet?.balance
                                                    ? numberToCurrency(
                                                          wallet.balance,
                                                      )
                                                    : ''}
                                            </Typography>
                                        )}
                                </>
                            }
                            value="wallet"
                        />
                    </div>

                    <FormControlLabel
                        control={
                            <Radio
                                disabled={
                                    !userAutocompleteValue?.uuid || isDisabled
                                }
                                size="small"
                            />
                        }
                        label="Potong TBS"
                        value="installment"
                    />
                </RadioGroup>

                {errors.payment_method && (
                    <FormHelperText>{errors.payment_method}</FormHelperText>
                )}
            </FormControl>

            {payment_method === 'installment' && (
                <>
                    {userAutocompleteValue?.uuid && !is_paid && (
                        <CreditorCard data={userAutocompleteValue} />
                    )}

                    <Typography component="div" mt={2} variant="h6">
                        Rincian Potongan TBS
                    </Typography>

                    <Box display="flex" gap={1} mt={1}>
                        <NumericFormat
                            disabled={isDisabled}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        %
                                    </InputAdornment>
                                ),
                            }}
                            label="Jasa"
                            name="interest_percent"
                            onValueChange={({ floatValue }) =>
                                debounce(() =>
                                    setFieldValue(
                                        'interest_percent',
                                        floatValue,
                                    ),
                                )
                            }
                            value={interest_percent}
                            {...errorsToHelperTextObj(errors.interest_percent)}
                        />

                        <NumericFormat
                            decimalScale={0}
                            disabled={isDisabled}
                            inputProps={{
                                maxLength: 2,
                                minLength: 1,
                            }}
                            label="Jangka Waktu"
                            min={1}
                            name="n_term"
                            onValueChange={({ floatValue }) =>
                                debounce(() =>
                                    setFieldValue('n_term', floatValue),
                                )
                            }
                            value={n_term}
                            {...errorsToHelperTextObj(errors.n_term)}
                        />

                        <FormControl
                            disabled={isDisabled}
                            error={Boolean(errors.n_term_unit)}
                            fullWidth
                            margin="dense"
                            required>
                            <InputLabel size="small">
                                Satuan Waktu Angsuran
                            </InputLabel>

                            <Select
                                label="Satuan Waktu Angsuran"
                                name="n_term_unit"
                                onChange={({ target: { value } }) =>
                                    setFieldValue('n_term_unit', value)
                                }
                                required
                                size="small"
                                value={n_term_unit}>
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
                        alignItems="flex-end"
                        display="flex"
                        gap={1.5}
                        justifyContent="end">
                        <Typography
                            color="gray"
                            component="span"
                            fontWeight="bold"
                            variant="h6">
                            TOTAL KESELURUHAN
                        </Typography>

                        <Typography component="span" variant="h6">
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
                    <Grid alignItems="end" container mt={1} spacing={1.5}>
                        <Grid item textAlign="end" xs={9}>
                            <Typography
                                color="gray"
                                component="div"
                                fontWeight="bold"
                                variant="h6">
                                TOTAL KESELURUHAN
                            </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <NumericFormat
                                allowNegative
                                decimalScale={0}
                                disabled={isDisabled}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
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
                                }}
                                inputProps={{
                                    maxLength: 3,
                                    minLength: 1,
                                }}
                                label="Penyesuaian"
                                name="adjustment_rp"
                                onValueChange={({ floatValue }) =>
                                    debounce(() =>
                                        setFieldValue(
                                            'adjustment_rp',
                                            floatValue,
                                        ),
                                    )
                                }
                                value={adjustment_rp}
                                {...errorsToHelperTextObj(errors.adjustment_rp)}
                            />

                            <Typography component="div" variant="h6">
                                {numberToCurrency(
                                    totalRp + (adjustment_rp ?? 0),
                                )}
                            </Typography>
                        </Grid>
                    </Grid>

                    <div
                        style={{
                            marginBottom: '1rem',
                            marginTop: '1rem',
                        }}>
                        <SelectFromApi
                            disabled={isDisabled}
                            endpoint="/data/cashes"
                            label="Telah Dibayar Ke Kas"
                            margin="dense"
                            onValueChange={({ uuid }: CashType) =>
                                setFieldValue('cashable_uuid', uuid)
                            }
                            required
                            selectProps={{
                                name: 'cashable_uuid',
                                value: cashable_uuid,
                            }}
                            size="small"
                            {...errorsToHelperTextObj(errors.cashable_uuid)}
                        />
                    </div>
                </>
            )}

            {isAuthHasRole(Role.FARM_INPUT_MANAGER) && !isNew && (
                <UserActivityLogs
                    data={typedStatus?.user_activity_logs ?? []}
                />
            )}
        </FormikForm>
    )
})

export default ProductSaleForm

export const EMPTY_FORM_DATA: Partial<{
    buyer_user_uuid: null | ProductSaleORM['buyer_user_uuid']
    at: null | ProductSaleORM['at']
    note: '' | ProductSaleORM['note']
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
    interest_percent: ProductSaleORM['interest_percent']
    n_term: ProductSaleORM['n_term']
    n_term_unit: null | ProductSaleORM['n_term_unit']
}> = {
    buyer_user_uuid: null,
    cashable_uuid: '',
    note: '',

    payment_method: null,
    product_sale_details: [
        {
            product: null,
            product_id: null,
        },
    ],
}

export const EMPTY_FORM_STATUS: null | ProductSaleORM = null
