import { FC, useState, FormEvent } from 'react'
import useSWR from 'swr'

import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'

import FormType from '@/components/Global/Form/Form.type'
import SelectFromApi from '@/components/Global/SelectFromApi'
import useValidationErrors from '@/hooks/useValidationErrors'
import NumericFormat from '@/components/Global/NumericFormat'
import axios from '@/lib/axios'
import UserAutocomplete from '@/components/Global/UserAutocomplete'

const WalletWithdrawForm: FC<FormType<any>> = ({
    loading,
    actionsSlot,
    setSubmitting,
    onSubmitted,
}) => {
    const [userUuid, setUserUuid] = useState<string | undefined>(undefined)
    const [fromCash, setFromCash] = useState<any>(undefined)
    const { validationErrors, setValidationErrors, clearByName } =
        useValidationErrors()

    const { data: userCash, isLoading } = useSWR(
        userUuid ? `/wallets/user/${userUuid}` : null,
        url => axios.get(url).then(response => response.data),
    )

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)

        setSubmitting(true)

        try {
            await axios.post('/wallets/withdraw', formData)

            onSubmitted()
        } catch (error: any) {
            if (!(error.response?.status === 422)) {
                throw error
            }

            setValidationErrors(error.response.data.errors)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <input type="hidden" name="user_uuid" value={userUuid || ''} />

            <UserAutocomplete
                fullWidth
                disabled={loading}
                onChange={(_, user) => {
                    clearByName('user_uuid')
                    setUserUuid(user?.uuid)
                }}
                textFieldProps={{
                    required: true,
                    label: 'Pengguna',
                    margin: 'normal',
                    error: Boolean(validationErrors.user_uuid),
                    helperText:
                        validationErrors.user_uuid ||
                        (isLoading ? (
                            <Skeleton />
                        ) : (
                            <NumericFormat
                                value={userCash?.balance}
                                prefix="Saldo: Rp. "
                                displayType="text"
                                decimalScale={0}
                            />
                        )),
                }}
            />

            <SelectFromApi
                disabled={loading}
                fullWidth
                endpoint="/data/cashes"
                label="Dari kas"
                required
                margin="dense"
                selectProps={{
                    name: 'from_cash_uuid',
                }}
                defaultValue=""
                onValueChange={value => {
                    clearByName('from_cash_uuid')
                    setFromCash(value)
                }}
                error={Boolean(validationErrors.from_cash_uuid)}
                helperText={
                    validationErrors.from_cash_uuid || (
                        <NumericFormat
                            value={fromCash?.balance}
                            displayType="text"
                            prefix="Saldo: Rp. "
                            decimalScale={0}
                        />
                    )
                }
            />

            <input type="hidden" name="amount" />

            <TextField
                disabled={loading}
                fullWidth
                required
                margin="normal"
                label="Jumlah"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">Rp</InputAdornment>
                    ),
                    inputComponent: NumericFormat as any,
                }}
                inputProps={{
                    allowNegative: false,
                    onValueChange: ({ floatValue }: any) => {
                        clearByName('amount')

                        document
                            .querySelector('input[name="amount"]')
                            ?.setAttribute('value', floatValue)
                    },
                }}
                error={Boolean(validationErrors.amount)}
                helperText={validationErrors.amount}
            />

            {actionsSlot}
        </form>
    )
}

export default WalletWithdrawForm
