// types
import type { UUID } from 'crypto'
import type RentItemRent from '@/dataTypes/RentItemRent'
import type { FormikProps } from 'formik'
import type WalletType from '@/dataTypes/Wallet'
import type CashType from '@/dataTypes/Cash'
import type RentItemType from '@/dataTypes/RentItem'
import type UserType from '@/dataTypes/User'

// vendors
import { memo, useState } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
import { FastField } from 'formik'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/FormikForm'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import UserAutocomplete from '@/components/Global/UserAutocomplete'
import LoadingAddorment from '@/components/LoadingAddorment'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
// providers
import useAuth from '@/providers/Auth'
import debounce from '@/utils/debounce'
import numberToCurrency from '@/utils/numberToCurrency'
import SelectFromApi from '@/components/Global/SelectFromApi'
import FarmerGroupType from '@/dataTypes/FarmerGroup'
import TbsPerformanceChartWithAutoFetch from '../user-loans/CrediturCard/TbsPerformanceChart/WithAutoFetch'
import { FormGroup, Switch } from '@mui/material'

const HeavyEquipmentRentForm = memo(function HeavyEquipmentRentForm({
    dirty,
    errors,
    isSubmitting,
    values: {
        uuid,
        // short_text_id: string
        inventory_item_uuid,

        // by_user_uuid,
        by_user,

        rate_rp_per_unit,
        rate_unit,

        for_n_units,
        for_at,
        finished_at,
        // note,

        payment_method,
        farmer_group_uuid,
        farmer_group,

        adjustment_rp,

        interest_percent,
        n_term,
        n_term_unit,

        cashable_uuid,

        is_paid,

        operated_by_user,

        start_hm,
        end_hm,
    },
    setFieldValue,
}: FormikProps<HeavyEquipmentRentFormValues>) {
    const { userHasPermission } = useAuth()
    const [rentType, setRentType] = useState<
        'personal' | 'farmer-group' | null
    >(!uuid ? null : farmer_group ? 'farmer-group' : 'personal')
    const [isFinished, setIsFinished] = useState(Boolean(finished_at))

    const baseRp: number =
        (rate_rp_per_unit ?? 0) *
        (for_n_units !== undefined && for_n_units > 0 ? for_n_units : 0)
    const ifCashRp = payment_method === 'cash' ? adjustment_rp ?? 0 : 0
    const ifInstallmentRp =
        payment_method === 'installment'
            ? Math.ceil(
                  baseRp * ((interest_percent ?? 0) / 100) * (n_term ?? 0),
              )
            : 0

    const totalRp: number = baseRp + ifCashRp + ifInstallmentRp

    const { data: wallet, isLoading: isWalletLoading } = useSWR<WalletType>(
        by_user?.uuid ? `/wallets/user/${by_user?.uuid}` : null,
    )

    const { data: fgWallet, isLoading: isFgWalletLoading } = useSWR<WalletType>(
        farmer_group_uuid ? `/wallets/fg/${farmer_group_uuid}` : null,
    )

    const isBalanceEnough = (wallet?.balance ?? 0) > baseRp
    const isFgBalanceEnough = (fgWallet?.balance ?? 0) > baseRp

    const isNew = !uuid
    const isPropcessing = isSubmitting
    const isDisabled =
        is_paid ||
        isPropcessing ||
        !userHasPermission([
            'create heavy equipment rent',
            'update heavy equipment rent',
        ])

    const isCashMethodDisabled =
        baseRp <= 0 ||
        !isFinished ||
        !finished_at ||
        rentType === 'farmer-group' ||
        isDisabled

    const isWalletMethodDisabled =
        (isFinished && baseRp <= 0) ||
        !by_user?.uuid ||
        !wallet ||
        !isBalanceEnough ||
        rentType === 'farmer-group' ||
        isWalletLoading ||
        isDisabled

    const isInstallmentMethodDisabled =
        (isFinished && baseRp <= 0) ||
        !by_user?.uuid ||
        rentType === 'farmer-group' ||
        isDisabled

    const isFgWalletDisabled =
        (isFinished && baseRp <= 0) ||
        !farmer_group_uuid ||
        !isFgBalanceEnough ||
        isFgWalletLoading ||
        rentType !== 'farmer-group' ||
        isDisabled

    const checkAndClearPaymentMethod = () => {
        if (
            (isCashMethodDisabled && payment_method === 'cash') ||
            (isWalletMethodDisabled && payment_method === 'wallet') ||
            (isInstallmentMethodDisabled && payment_method === 'installment') ||
            (isFgWalletDisabled && payment_method === 'fgwallet')
        ) {
            setFieldValue('payment_method', null)
        }
    }

    return (
        <FormikForm
            id="heavy-equipment-rent-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
                cancelButton: {
                    children: 'Batal',
                },
            }}>
            {!isNew && (
                <FastField
                    name="uuid"
                    component={TextFieldFastableComponent}
                    disabled={true}
                    variant="filled"
                    label="UUID"
                    margin="normal"
                    {...errorsToHelperTextObj(errors.uuid)}
                />
            )}
            <FormControl>
                <FormLabel id="rent-type" required>
                    Jenis
                </FormLabel>

                <RadioGroup
                    row
                    aria-labelledby="rent-type"
                    name="rent-type"
                    value={rentType}
                    onChange={({ target: { value } }) => {
                        setRentType(
                            value === 'personal' || value === 'farmer-group'
                                ? value
                                : null,
                        )
                        checkAndClearPaymentMethod()
                    }}>
                    <FormControlLabel
                        value="personal"
                        control={<Radio required size="small" />}
                        label="Perorangan"
                    />

                    <FormControlLabel
                        value="farmer-group"
                        control={<Radio size="small" />}
                        label="Kelompok Tani"
                    />
                </RadioGroup>
            </FormControl>
            <Fade in={rentType === 'farmer-group'} unmountOnExit>
                <span>
                    <SelectFromApi
                        fullWidth
                        disabled={isDisabled}
                        endpoint="/data/farmer-groups"
                        label="Kelompok Tani"
                        required
                        size="small"
                        margin="dense"
                        selectProps={{
                            name: 'farmer_group_uuid',
                            value: farmer_group_uuid ?? '',
                            disabled: isDisabled,
                        }}
                        onValueChange={(value: FarmerGroupType) =>
                            setFieldValue('farmer_group_uuid', value.uuid)
                        }
                        {...errorsToHelperTextObj(errors.farmer_group_uuid)}
                    />
                </span>
            </Fade>

            <UserAutocomplete
                disabled={isDisabled}
                fullWidth
                onChange={(_, user) => {
                    setFieldValue('by_user', user)
                    setFieldValue('by_user_uuid', user?.uuid)
                }}
                value={by_user ?? null}
                size="small"
                textFieldProps={{
                    label:
                        rentType === 'farmer-group'
                            ? 'Penanggung Jawab'
                            : 'Penyewa',
                    required: rentType === 'farmer-group',
                    margin: 'dense',
                    ...errorsToHelperTextObj(errors.by_user_uuid),
                }}
            />

            <DatePicker
                value={for_at ? dayjs(for_at) : null}
                disabled={isDisabled}
                label="Untuk Tanggal"
                onChange={date =>
                    setFieldValue('for_at', date?.format('YYYY-MM-DD'))
                }
                slotProps={{
                    textField: {
                        ...errorsToHelperTextObj(errors.for_at),
                    },
                }}
            />
            <SelectFromApi
                fullWidth
                required
                dataKey="inventory_item_uuid"
                disabled={isDisabled}
                endpoint="/data/rentable-inventory-items"
                label="Alat Berat"
                size="small"
                margin="dense"
                selectProps={{
                    name: 'inventory_item_uuid',
                    value: inventory_item_uuid ?? '',
                }}
                renderOption={(rentItem: RentItemType) => (
                    <MenuItem
                        key={rentItem.inventory_item_uuid}
                        value={rentItem.inventory_item_uuid}>
                        {rentItem.inventory_item.code && (
                            <Chip
                                label={rentItem.inventory_item.code}
                                size="small"
                                variant="outlined"
                                sx={{
                                    mr: 1,
                                }}
                            />
                        )}

                        {rentItem.inventory_item.name}
                    </MenuItem>
                )}
                onValueChange={(rentItem: RentItemType) => {
                    setFieldValue(
                        'inventory_item_uuid',
                        rentItem.inventory_item_uuid,
                    )
                    setFieldValue(
                        'rate_rp_per_unit',
                        rentItem.default_rate_rp_per_unit,
                    )
                    setFieldValue('rate_unit', rentItem.default_rate_unit)
                }}
                {...errorsToHelperTextObj(errors.inventory_item_uuid)}
            />

            <NumericFormat
                label="Biaya"
                disabled={isDisabled}
                decimalScale={0}
                value={rate_rp_per_unit}
                name="rate_rp_per_unit"
                onValueChange={({ floatValue }) =>
                    debounce(() =>
                        setFieldValue('rate_rp_per_unit', floatValue),
                    )
                }
                InputProps={{
                    startAdornment: <RpInputAdornment />,
                    endAdornment: (
                        <InputAdornment position="end">
                            / {rate_unit}
                        </InputAdornment>
                    ),
                }}
                {...errorsToHelperTextObj(
                    errors.rate_rp_per_unit || errors.rate_unit,
                )}
            />

            <UserAutocomplete
                disabled={isDisabled}
                fullWidth
                onChange={(_, user) => {
                    setFieldValue('operated_by_user', user)
                    setFieldValue('operated_by_user_uuid', user?.uuid)
                }}
                value={operated_by_user ?? null}
                size="small"
                textFieldProps={{
                    label: 'Operator',
                    required: true,
                    margin: 'dense',
                    ...errorsToHelperTextObj(errors.operated_by_user),
                }}
            />

            <FastField
                name="note"
                required={false}
                component={TextFieldFastableComponent}
                multiline
                disabled={isDisabled}
                rows={2}
                label="Catatan Tambahan"
                {...errorsToHelperTextObj(errors.note)}
            />

            <FormControl
                margin="dense"
                fullWidth
                disabled={isDisabled}
                sx={{
                    pl: 2,
                }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isFinished}
                                onChange={({ target: { checked } }) => {
                                    setIsFinished(checked)
                                    checkAndClearPaymentMethod()
                                    setFieldValue('finished_at', undefined)
                                    setFieldValue('start_hm', undefined)
                                    setFieldValue('end_hm', undefined)
                                }}
                                name="is_finished"
                            />
                        }
                        label="Selesai"
                    />
                </FormGroup>
            </FormControl>

            <Fade in={isFinished} unmountOnExit>
                <div>
                    <DatePicker
                        value={finished_at ? dayjs(finished_at) : null}
                        disabled={isDisabled}
                        label="Tanggal Selesai"
                        onChange={date =>
                            setFieldValue(
                                'finished_at',
                                date?.format('YYYY-MM-DD'),
                            )
                        }
                        slotProps={{
                            textField: {
                                ...errorsToHelperTextObj(errors.finished_at),
                            },
                        }}
                    />

                    <Box display="inline-flex" gap={1}>
                        <NumericFormat
                            label="Awal"
                            disabled={isDisabled}
                            value={start_hm}
                            name="start_hm"
                            onValueChange={({ floatValue }) =>
                                debounce(() => {
                                    setFieldValue('start_hm', floatValue)
                                    setFieldValue(
                                        'for_n_units',
                                        (end_hm ?? 0) - (floatValue ?? 0),
                                    )
                                })
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {rate_unit}
                                    </InputAdornment>
                                ),
                            }}
                            {...errorsToHelperTextObj(errors.start_hm)}
                        />

                        <NumericFormat
                            label="Akhir"
                            disabled={isDisabled}
                            min={start_hm}
                            value={end_hm}
                            name="end_hm"
                            onValueChange={({ floatValue }) =>
                                debounce(() => {
                                    setFieldValue('end_hm', floatValue)
                                    setFieldValue(
                                        'for_n_units',
                                        (floatValue ?? 0) - (start_hm ?? 0),
                                    )
                                })
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {rate_unit}
                                    </InputAdornment>
                                ),
                            }}
                            {...errorsToHelperTextObj(
                                (start_hm && end_hm && start_hm > end_hm
                                    ? 'H.M mulai tidak boleh lebih besar dari H.M akhir'
                                    : undefined) ?? errors.end_hm,
                            )}
                        />
                    </Box>

                    <div
                        style={{
                            marginTop: '1rem',
                        }}>
                        <Typography
                            component="div"
                            color="gray"
                            fontWeight="bold">
                            TOTAL KESELURUHAN
                        </Typography>
                        <Typography component="div">
                            {numberToCurrency(totalRp)}
                        </Typography>
                    </div>
                </div>
            </Fade>

            <FormControl
                margin="normal"
                size="small"
                disabled={isDisabled}
                required={isFinished}
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
                        required={isFinished}
                        disabled={isCashMethodDisabled}
                        control={<Radio size="small" />}
                        label="Tunai"
                    />

                    <FormControlLabel
                        value="wallet"
                        control={
                            <Radio
                                size="small"
                                disabled={isWalletMethodDisabled}
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

                                {wallet?.balance !== undefined && (
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color={
                                            isBalanceEnough
                                                ? undefined
                                                : 'error.main'
                                        }>
                                        {numberToCurrency(wallet.balance)}
                                    </Typography>
                                )}
                            </>
                        }
                    />

                    <FormControlLabel
                        value="installment"
                        control={
                            <Radio
                                size="small"
                                disabled={isInstallmentMethodDisabled}
                            />
                        }
                        label="Potong TBS"
                    />

                    <FormControlLabel
                        value="fgwallet"
                        control={
                            <Radio size="small" disabled={isFgWalletDisabled} />
                        }
                        label={
                            <>
                                <span>Saldo Kelompok Tani</span>

                                {isFgWalletLoading && (
                                    <div style={{ marginTop: '.7rem' }}>
                                        <LoadingAddorment show={true} />
                                    </div>
                                )}

                                {fgWallet?.balance !== undefined && (
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color={
                                            isFgBalanceEnough
                                                ? undefined
                                                : 'error.main'
                                        }>
                                        {numberToCurrency(fgWallet.balance)}
                                    </Typography>
                                )}
                            </>
                        }
                    />
                </RadioGroup>

                {errors.payment_method && (
                    <FormHelperText>{errors.payment_method}</FormHelperText>
                )}
            </FormControl>

            <Fade in={payment_method === 'installment'} unmountOnExit>
                <div>
                    {by_user?.uuid && (
                        <>
                            <Typography variant="h6" component="div" mt={2}>
                                Performa TBS &mdash; {by_user?.name}
                            </Typography>

                            <TbsPerformanceChartWithAutoFetch
                                userUuid={by_user.uuid}
                            />
                        </>
                    )}

                    <Typography variant="h6" component="div" mt={2}>
                        Rincian Potongan TBS
                    </Typography>

                    <Box display="flex" gap={1} mt={1}>
                        <NumericFormat
                            label="Jasa"
                            disabled={isDisabled}
                            decimalScale={0}
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
                            inputProps={{
                                minLength: 1,
                                maxLength: 2,
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
                                value={n_term_unit ?? ''}
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
                </div>
            </Fade>

            <Fade in={payment_method === 'cash'} unmountOnExit>
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
                            value: cashable_uuid ?? '',
                            name: 'cashable_uuid',
                        }}
                        onValueChange={({ uuid }: CashType) =>
                            setFieldValue('cashable_uuid', uuid)
                        }
                        renderOption={(cash: CashType) => (
                            <MenuItem key={cash.uuid} value={cash.uuid}>
                                {cash.code && (
                                    <Chip
                                        label={cash.code}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            mr: 1,
                                        }}
                                    />
                                )}

                                {cash.name}
                            </MenuItem>
                        )}
                        {...errorsToHelperTextObj(errors.cashable_uuid)}
                    />
                </div>
            </Fade>
        </FormikForm>
    )
})

export default HeavyEquipmentRentForm

export type HeavyEquipmentRentFormValues = Partial<
    RentItemRent & {
        payment_method: 'cash' | 'wallet' | 'installment' | 'fgwallet'
        farmer_group_uuid: UUID
        adjustment_rp: number

        interest_percent: number
        n_term: number
        n_term_unit: 'minggu' | 'bulan'

        cashable_uuid: UUID
        start_hm: number
        end_hm: number

        operated_by_user: UserType
        operated_by_user_uuid: UUID
    }
>
