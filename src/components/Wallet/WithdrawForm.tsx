// types
import type { FormikProps } from 'formik'
import type { UUID } from 'crypto'
import type UserType from '@/dataTypes/User'
import type CashType from '@/dataTypes/Cash'
// vendors
import { useState } from 'react'
import useSWR from 'swr'
// materials
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
// componentns
import SelectFromApi from '@/components/Global/SelectFromApi'
import NumericFormat from '@/components/NumericFormat'
import FormikForm from '@/components/FormikForm'
import UserAutocomplete from '../UserAutocomplete'
import RpInputAdornment from '../InputAdornment/Rp'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import numberToCurrency from '@/utils/numberToCurrency'

export default function WalletWithdrawForm({
    dirty,
    errors,
    isSubmitting,
    values: {
        // user_uuid,
        from_cash_uuid,
        amount,
    },
    setFieldValue,
}: FormikProps<FormValuesType>) {
    const [user, setUser] = useState<UserType | null>(null)
    const [fromCash, setFromCash] = useState<CashType>()

    const { data: userCash, isLoading } = useSWR(
        user?.uuid ? `/wallets/user/${user.uuid}` : null,
    )

    const isPropcessing = isSubmitting || isLoading
    const disabled = isPropcessing

    return (
        <FormikForm
            id="user-wallet-withdraw-form"
            autoComplete="off"
            isNew={false}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: disabled,
                },
            }}>
            <UserAutocomplete
                showRole
                showNickname
                label="Pengguna"
                disabled={disabled}
                value={user}
                onChange={(_, value) => {
                    setFieldValue('user_uuid', value?.uuid)
                    setUser(value)
                }}
                error={Boolean(errors.user_uuid)}
                helperText={
                    errors.user_uuid ??
                    'Saldo: ' + numberToCurrency(userCash?.balance ?? 0)
                }
            />

            <SelectFromApi
                required
                endpoint="/data/cashes"
                label="Telah Dibayar Dari Kas"
                size="small"
                margin="dense"
                disabled={disabled}
                selectProps={{
                    value: from_cash_uuid ?? '',
                }}
                onValueChange={(cash: CashType) => {
                    setFromCash(cash)
                    setFieldValue('from_cash_uuid', cash.uuid)
                }}
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
                error={Boolean(errors?.from_cash_uuid)}
                helperText={
                    errors.user_uuid ??
                    'Saldo: ' + numberToCurrency(fromCash?.balance ?? 0)
                }
            />

            <NumericFormat
                min="10000"
                disabled={disabled}
                label="Jumlah Penarikan"
                InputProps={{
                    startAdornment: <RpInputAdornment />,
                }}
                onValueChange={({ floatValue }) =>
                    setFieldValue('amount', floatValue)
                }
                value={amount || ''}
                {...errorsToHelperTextObj(errors.amount)}
            />
        </FormikForm>
    )
}

export type FormValuesType = Partial<{
    user_uuid: UUID
    from_cash_uuid: UUID
    amount: number
}>
