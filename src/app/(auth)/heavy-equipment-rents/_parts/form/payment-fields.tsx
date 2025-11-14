// types

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
import type { FormikProps } from 'formik'
// vendors
import useSWR from 'swr'
import SelectFromApi from '@/components/Global/SelectFromApi'
// components
import LoadingAddorment from '@/components/input-adornments/loading'
import NumericFormat from '@/components/numeric-format'
import type CashType from '@/types/orms/cash'
import type WalletType from '@/types/orms/wallet'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'
// page components
import CrediturCard from '../../../../../components/pages/user-loans/creditor-card'
import type { HeavyEquipmentRentFormValues } from '.'

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
                disabled={isDisabled || is_paid}
                error={Boolean(errors.payment_method)}
                margin="normal"
                required
                size="small">
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
                        control={<Radio size="small" />}
                        disabled={isCashMethodDisabled}
                        label="Tunai"
                        required
                        value="cash"
                    />

                    <FormControlLabel
                        control={
                            <Radio
                                disabled={isWalletMethodDisabled}
                                size="small"
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
                                        color={
                                            isBalanceEnough
                                                ? undefined
                                                : 'error.main'
                                        }
                                        component="div"
                                        variant="caption">
                                        {numberToCurrency(wallet.balance)}
                                    </Typography>
                                )}
                            </>
                        }
                        value="wallet"
                    />

                    <FormControlLabel
                        control={
                            <Radio
                                disabled={isInstallmentMethodDisabled}
                                size="small"
                            />
                        }
                        label="Potong TBS"
                        value="installment"
                    />

                    <FormControlLabel
                        control={
                            <Radio disabled={isFgWalletDisabled} size="small" />
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
                                            color={
                                                isFgBalanceEnough
                                                    ? undefined
                                                    : 'error.main'
                                            }
                                            component="div"
                                            variant="caption">
                                            {numberToCurrency(fgWallet.balance)}
                                        </Typography>
                                    )}
                            </>
                        }
                        value="fgwallet"
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
                                setFieldValue('interest_percent', floatValue)
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
                                setFieldValue('n_term', floatValue)
                            }
                            value={n_term}
                            {...errorsToHelperTextObj(errors.n_term)}
                        />

                        <FormControl
                            disabled={isDisabled}
                            error={Boolean(errors.term_unit)}
                            fullWidth
                            margin="dense"
                            required>
                            <InputLabel size="small">
                                Satuan Waktu Angsuran
                            </InputLabel>

                            <Select
                                label="Satuan Waktu Angsuran"
                                name="term_unit"
                                onChange={({ target: { value } }) =>
                                    setFieldValue('term_unit', value)
                                }
                                required
                                size="small"
                                value={term_unit ?? ''}>
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
                        renderOption={(cash: CashType) => (
                            <MenuItem key={cash.uuid} value={cash.uuid}>
                                {cash.code && (
                                    <Chip
                                        label={cash.code}
                                        size="small"
                                        sx={{
                                            mr: 1,
                                        }}
                                        variant="outlined"
                                    />
                                )}

                                {cash.name}
                            </MenuItem>
                        )}
                        required
                        selectProps={{
                            name: 'cashable_uuid',
                            value: cashable_uuid ?? '',
                        }}
                        size="small"
                        {...errorsToHelperTextObj(errors.cashable_uuid)}
                    />
                </div>
            </Fade>
        </>
    )
}
