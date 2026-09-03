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
import { Activity, useState } from 'react'
// components
import DatePicker from '@/components/date-picker'
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import NumericFormat from '@/components/numeric-format'
import TextField from '@/components/text-field'
// enums
import TransactionTag from '@/modules/transaction/enums/transaction-tag'
// types
import type CashType from '@/types/orms/cash'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'
import RpInputAdornment from '../input-adornments/rp'
import TextFieldFastableComponent from '../text-field.fastable-component'

export default function WalletTxForm({
    dirty,
    errors,
    isSubmitting,
    values: { from_cash_uuid, type, to_business_unit_cash_uuid },
    setFieldValue,
}: FormikProps<FormValuesType>) {
    const [fromCash, setFromCash] = useState<CashType>()
    const [toBusinessUnitCash, setToBusinessUnitCash] = useState<CashType>()
    const [cashType, setCashType] = useState<'cash' | 'business-unit'>()

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="user-wallet-tx-form"
            isNew={false}
            processing={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isSubmitting,
                },
            }}
            submitting={isSubmitting}>
            <FormControl disabled={isSubmitting} size="small">
                <FormLabel id="tx-radio-group">Jenis</FormLabel>
                <RadioGroup
                    aria-labelledby="tx-radio-group"
                    onChange={({ target: { value } }) =>
                        setFieldValue('type', value)
                    }
                    row>
                    <FormControlLabel
                        control={<Radio size="small" />}
                        label="Masuk ke Wallet"
                        required
                        value="in"
                    />

                    <FormControlLabel
                        control={<Radio size="small" />}
                        label="Keluar dari Wallet"
                        value="out"
                    />
                </RadioGroup>
            </FormControl>

            <FormControl disabled={isSubmitting} size="small">
                <RadioGroup
                    aria-labelledby="tx-radio-group"
                    onChange={({ target: { value } }) => {
                        setCashType(value as 'cash' | 'business-unit')
                        setFieldValue('from_cash_uuid', null)
                        setFieldValue('to_business_unit_cash_uuid', null)
                    }}
                    row>
                    <FormControlLabel
                        control={<Radio size="small" />}
                        label="Melalui Kas"
                        required
                        value="cash"
                    />

                    <FormControlLabel
                        control={<Radio size="small" />}
                        label={(type === 'in' ? 'Dari' : 'Ke') + ' Unit Bisnis'}
                        value="business-unit"
                    />
                </RadioGroup>
            </FormControl>

            <DatePicker
                disabled={isSubmitting}
                label="Tanggal"
                maxDate={dayjs().endOf('month')}
                onChange={value =>
                    setFieldValue('at', value?.format('YYYY-MM-DD'))
                }
            />

            <Activity mode={cashType === 'cash' ? 'visible' : 'hidden'}>
                <SelectFromApi
                    disabled={isSubmitting}
                    endpoint="/data/cashes"
                    error={Boolean(errors?.from_cash_uuid)}
                    helperText={
                        errors.from_cash_uuid ??
                        'Saldo: ' + numberToCurrency(fromCash?.balance ?? 0)
                    }
                    label="Melalui Kas"
                    margin="dense"
                    onValueChange={(cash: CashType) => {
                        setFromCash(cash)
                        setToBusinessUnitCash(undefined)

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
                    required={cashType === 'cash'}
                    selectProps={{
                        value: from_cash_uuid ?? '',
                    }}
                />
            </Activity>

            <Activity
                mode={cashType === 'business-unit' ? 'visible' : 'hidden'}>
                <SelectFromApi
                    disabled={isSubmitting}
                    endpoint="/data/business-unit-cashes2"
                    error={Boolean(errors?.to_business_unit_cash_uuid)}
                    helperText={
                        errors.to_business_unit_cash_uuid ??
                        'Saldo: ' +
                            numberToCurrency(toBusinessUnitCash?.balance ?? 0)
                    }
                    label={(type === 'in' ? 'Dari' : 'Ke') + ' Unit Bisnis'}
                    margin="dense"
                    onValueChange={(cash: CashType) => {
                        setFromCash(undefined)
                        setToBusinessUnitCash(cash)
                        setFieldValue('to_business_unit_cash_uuid', cash.uuid)
                    }}
                    renderOption={(cash: CashType) => (
                        <MenuItem key={cash.uuid} value={cash.uuid}>
                            {cash.name}
                        </MenuItem>
                    )}
                    required={cashType === 'business-unit'}
                    selectProps={{
                        value: to_business_unit_cash_uuid ?? '',
                    }}
                />
            </Activity>

            <NumericFormat
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                onChange={(_, value) => setFieldValue('tag', value)}
                options={[
                    TransactionTag.ANGSURAN_ALAT_BERAT,
                    TransactionTag.ANGSURAN_BELAYAN_SPARE_PARTS,
                    TransactionTag.GAJIAN_TBS,
                    TransactionTag.KOREKSI,
                    TransactionTag.POTONGAN_JASA_PANEN,
                    TransactionTag.POTONGAN_JASA_PERAWATAN,
                    TransactionTag.TARIK_TUNAI,
                    TransactionTag.LAIN_LAIN,
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
                disabled={isSubmitting}
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
    to_business_unit_cash_uuid: UUID
    type: 'in' | 'out'
    tag: TransactionTag
}>
