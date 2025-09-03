// types
import type { FormikProps } from 'formik'
import type { HeavyEquipmentRentFormValues } from '.'
import type CashType from '@/types/orms/cash'
import type WalletType from '@/types/orms/wallet'
// vendors
import useSWR from 'swr'
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
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
// components
import LoadingAddorment from '@/components/LoadingAddorment'
import NumericFormat from '@/components/NumericFormat'
import SelectFromApi from '@/components/Global/SelectFromApi'
// page components
import CrediturCard from '../../../../../components/pages/user-loans/creditor-card'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'

export default function HerPaymentFields({
    values: {
        is_paid,
        by_user,
        validated_by_admin_at,
        term_unit,
        cashable_uuid,
        farmer_group_uuid,
        type,
        payment_method,
        interest_percent,
        n_term,
        finished_at,
    },
    totalRp,
    errors,
    isDisabled,
    setFieldValue,
}: {
    values: HeavyEquipmentRentFormValues
    totalRp: number
    isDisabled: boolean
    setFieldValue: FormikProps<HeavyEquipmentRentFormValues>['setFieldValue']
    errors: FormikProps<HeavyEquipmentRentFormValues>['errors']
}) {
    const { data: wallet, isLoading: isWalletLoading } = useSWR<WalletType>(
        finished_at && by_user?.uuid && !validated_by_admin_at
            ? `/wallets/user/${by_user?.uuid}`
            : null,
    )

    const { data: fgWallet, isLoading: isFgWalletLoading } = useSWR<WalletType>(
        finished_at && farmer_group_uuid && !validated_by_admin_at
            ? `/wallets/fg/${farmer_group_uuid}`
            : null,
    )

    if (!finished_at) return null

    const isBalanceEnough = (wallet?.balance ?? 0) > totalRp
    const isFgBalanceEnough = (fgWallet?.balance ?? 0) > totalRp

    const isCashMethodDisabled =
        isDisabled || totalRp <= 0 || type === 'farmer-group'

    const isWalletMethodDisabled =
        isDisabled ||
        totalRp <= 0 ||
        !by_user?.uuid ||
        !wallet ||
        !isBalanceEnough ||
        type !== 'personal' ||
        isWalletLoading

    const isInstallmentMethodDisabled =
        isDisabled || totalRp <= 0 || !by_user?.uuid || type !== 'personal'

    const isFgWalletDisabled =
        isDisabled ||
        totalRp <= 0 ||
        !farmer_group_uuid ||
        isFgWalletLoading ||
        type !== 'farmer-group'

    return (
        <>
            <FormControl
                margin="normal"
                size="small"
                disabled={isDisabled || is_paid}
                required
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
                        required
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

                                {wallet?.balance !== undefined && !is_paid && (
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

                                {fgWallet?.balance !== undefined &&
                                    !is_paid && (
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

            <Fade
                in={
                    payment_method === 'installment' &&
                    type !== 'public-service'
                }
                unmountOnExit>
                <div>
                    {by_user?.uuid && !is_paid && (
                        <CrediturCard data={by_user} />
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
                                setFieldValue('interest_percent', floatValue)
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
                                setFieldValue('n_term', floatValue)
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

            <Fade
                in={payment_method === 'cash' && type !== 'public-service'}
                unmountOnExit>
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
        </>
    )
}
