// types

// materials
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import type { UUID } from 'crypto'
import dayjs from 'dayjs'
import type { FormikProps } from 'formik'
import { FastField } from 'formik'
// vendors
import { useState } from 'react'
import DatePicker from '@/components/date-picker'
// components
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import TransactionTag from '@/modules/transaction/enums/transaction-tag'
import type CashType from '@/types/orms/cash'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'
import RpInputAdornment from '../input-adornments/rp'
import TextFieldFastableComponent from '../TextField/FastableComponent'

export default function WalletTxForm({
    dirty,
    errors,
    isSubmitting,
    values: { from_cash_uuid },
    setFieldValue,
}: FormikProps<FormValuesType>) {
    const [fromCash, setFromCash] = useState<CashType>()

    const isPropcessing = isSubmitting
    const disabled = isPropcessing

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="user-wallet-tx-form"
            isNew={false}
            processing={isPropcessing}
            slotProps={{
                submitButton: {
                    disabled: disabled,
                },
            }}
            submitting={isSubmitting}>
            <FormControl disabled={disabled} size="small">
                <FormLabel id="tx-radio-group">Jenis</FormLabel>

                <RadioGroup
                    aria-labelledby="tx-radio-group"
                    onChange={({ target: { value } }) =>
                        setFieldValue('type', value)
                    }
                    row>
                    <FormControlLabel
                        control={<Radio size="small" />}
                        label="Masuk"
                        required
                        value="in"
                    />

                    <FormControlLabel
                        control={<Radio size="small" />}
                        label="Keluar"
                        value="out"
                    />
                </RadioGroup>
            </FormControl>

            <DatePicker
                disabled={disabled}
                label="Tanggal"
                maxDate={dayjs().endOf('month')}
                onChange={value =>
                    setFieldValue('at', value?.format('YYYY-MM-DD'))
                }
            />

            <SelectFromApi
                disabled={disabled}
                endpoint="/data/cashes2"
                error={Boolean(errors?.from_cash_uuid)}
                helperText={
                    errors.from_cash_uuid ??
                    'Saldo: ' + numberToCurrency(fromCash?.balance ?? 0)
                }
                label="Melalui Kas"
                margin="dense"
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
                    value: from_cash_uuid ?? '',
                }}
                size="small"
            />

            <NumericFormat
                disabled={disabled}
                InputProps={{
                    startAdornment: <RpInputAdornment />,
                }}
                label="Jumlah"
                min="10000"
                onValueChange={({ floatValue }) =>
                    setFieldValue('amount', floatValue)
                }
                {...errorsToHelperTextObj(errors.amount)}
            />

            <Autocomplete
                disabled={disabled}
                onChange={(_, value) => setFieldValue('tag', value)}
                options={[
                    TransactionTag.ARISAN,
                    TransactionTag.ANGSURAN_BELAYAN_SPARE_PARTS,
                    TransactionTag.EXCAVATOR,
                    TransactionTag.GAJIAN_TBS,
                    TransactionTag.KOREKSI,
                    TransactionTag.POTONGAN_JASA_PANEN,
                    TransactionTag.POTONGAN_JASA_PERAWATAN,
                    TransactionTag.TARIK_TUNAI,
                ]}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Kategori"
                        placeholder="Kategori"
                        {...errorsToHelperTextObj(errors.tag)}
                    />
                )}
            />

            <FastField
                component={TextFieldFastableComponent}
                disabled={disabled}
                label="Keterangan"
                multiline
                name="desc"
                rows={2}
            />
        </FormikForm>
    )
}

type FormValuesType = Partial<{
    at: string
    amount: number
    desc: string
    from_cash_uuid: UUID
    type: 'in' | 'out'
    tag: TransactionTag
}>
