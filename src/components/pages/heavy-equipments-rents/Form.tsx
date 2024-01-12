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
import LoadingAddorment from '@/components/LoadingAddorment'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextField from '@/components/TextField'
import UserAutocomplete from '@/components/Global/UserAutocomplete'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import debounce from '@/utils/debounce'
// providers
import useAuth from '@/providers/Auth'
import numberToCurrency from '@/utils/numberToCurrency'
import SelectFromApi from '@/components/Global/SelectFromApi'
import FarmerGroupType from '@/dataTypes/FarmerGroup'
import TbsPerformanceChartWithAutoFetch from '../user-loans/CrediturCard/TbsPerformanceChart/WithAutoFetch'

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

        adjustment_rp, // its unused but sedia payung sebelum hujan

        interest_percent,
        n_term,
        term_unit,

        cashable_uuid,

        is_paid,

        operated_by_user,
        heavy_equipment_rent,
    },
    setFieldValue,
}: FormikProps<HeavyEquipmentRentFormValues>) {
    const { userHasPermission } = useAuth()
    const [rentType, setRentType] = useState<
        'personal' | 'farmer-group' | null
    >(!uuid ? null : farmer_group ? 'farmer-group' : 'personal')

    const { start_hm = 0, end_hm = 0 } = heavy_equipment_rent ?? {}

    const baseRp: number =
        Math.max(end_hm - start_hm, for_n_units ?? 0) * (rate_rp_per_unit ?? 0)

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
        baseRp <= 0 || !finished_at || rentType === 'farmer-group' || isDisabled

    const isWalletMethodDisabled =
        (finished_at && baseRp <= 0) ||
        !by_user?.uuid ||
        !wallet ||
        !isBalanceEnough ||
        rentType === 'farmer-group' ||
        isWalletLoading ||
        isDisabled

    const isInstallmentMethodDisabled =
        (finished_at && baseRp <= 0) ||
        !by_user?.uuid ||
        rentType === 'farmer-group' ||
        isDisabled

    const isFgWalletDisabled =
        (finished_at && baseRp <= 0) ||
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
            <TextField
                label="Kode"
                value={uuid?.substring(uuid?.length - 6).toUpperCase()}
                variant="filled"
                disabled
                {...errorsToHelperTextObj(errors.uuid)}
            />

            <FormControl disabled={isDisabled || Boolean(finished_at)}>
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
                        disabled={isDisabled || Boolean(finished_at)}
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
                disabled={isDisabled || Boolean(finished_at)}
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
                disabled={isDisabled || Boolean(finished_at)}
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
                disabled={isDisabled || Boolean(finished_at)}
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

            <UserAutocomplete
                disabled={isDisabled || Boolean(finished_at)}
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

            <Box display="inline-flex" gap={1}>
                <NumericFormat
                    label="Biaya"
                    disabled={isDisabled || Boolean(finished_at)}
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

                <NumericFormat
                    label="Pesan Untuk"
                    disabled={isDisabled || Boolean(finished_at)}
                    value={for_n_units}
                    name="for_n_units"
                    onValueChange={({ floatValue }) =>
                        debounce(() => setFieldValue('for_n_units', floatValue))
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {rate_unit}
                            </InputAdornment>
                        ),
                    }}
                    {...errorsToHelperTextObj(errors.for_n_units)}
                />
            </Box>

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

            <Fade in={Boolean(finished_at)} unmountOnExit>
                <div>
                    <DatePicker
                        value={dayjs(finished_at)}
                        disabled={true}
                        label="Dikerjakan operator pada"
                        sx={{ mt: 3 }}
                    />

                    <Box display="inline-flex" gap={1}>
                        <NumericFormat
                            label="H.M Awal"
                            disabled={true}
                            value={heavy_equipment_rent?.start_hm ?? ''}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {rate_unit}
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <NumericFormat
                            label="H.M Akhir"
                            disabled={true}
                            value={heavy_equipment_rent?.end_hm}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {rate_unit}
                                    </InputAdornment>
                                ),
                            }}
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
                disabled={isDisabled || is_paid}
                required={Boolean(finished_at)}
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
                        required={Boolean(finished_at)}
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
                            error={Boolean(errors.term_unit)}>
                            <InputLabel size="small">
                                Satuan Waktu Angsuran
                            </InputLabel>

                            <Select
                                label="Satuan Waktu Angsuran"
                                size="small"
                                required
                                name="term_unit"
                                value={term_unit ?? ''}
                                onChange={({ target: { value } }) =>
                                    setFieldValue('term_unit', value)
                                }>
                                <MenuItem value="minggu">Minggu</MenuItem>
                                <MenuItem value="bulan">Bulan</MenuItem>
                            </Select>
                            {errors.term_unit && (
                                <FormHelperText>
                                    {errors.term_unit}
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
        term_unit: 'minggu' | 'bulan'

        cashable_uuid: UUID

        operated_by_user: UserType
        operated_by_user_uuid: UUID
    }
>
