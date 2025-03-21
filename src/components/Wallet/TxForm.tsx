// types
import type { FormikProps } from 'formik'
import type { UUID } from 'crypto'
import type CashType from '@/dataTypes/Cash'
import type WalletType from '@/dataTypes/Wallet'
// vendors
import { useState } from 'react'
import { FastField } from 'formik'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
// componentns
import FormikForm from '@/components/FormikForm'
import InfoBox from '@/components/InfoBox'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '../InputAdornment/Rp'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextField from '@/components/TextField'
// icons
import ViewListIcon from '@mui/icons-material/ViewList'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import numberToCurrency from '@/utils/numberToCurrency'
import DatePicker from '../DatePicker'
import TextFieldFastableComponent from '../TextField/FastableComponent'
import TransactionTag from '@/features/transaction/enums/transaction-tag'
import IconButton from '../IconButton'
import InstallmentTable from './TxForm/InstallmentTable'
import dayjs from 'dayjs'

export default function WalletTxForm({
    dirty,
    errors,
    isSubmitting,
    values: { from_cash_uuid },
    status,
    setFieldValue,
}: FormikProps<FormValuesType>) {
    const [fromCash, setFromCash] = useState<CashType>()
    const [openPiutang, setOpenPiutang] = useState(false)

    const typedStatus: WalletType = status

    const isPropcessing = isSubmitting
    const disabled = isPropcessing

    return (
        <FormikForm
            id="user-wallet-tx-form"
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
            <InfoBox
                mb={2}
                data={[
                    {
                        label: 'ID',
                        value: typedStatus.user?.id,
                    },
                    {
                        label: 'Nama',
                        value: typedStatus.user?.name,
                    },
                    {
                        label: 'Panggilan',
                        value: typedStatus.user?.nickname,
                    },
                    {
                        label: 'Saldo',
                        value: numberToCurrency(typedStatus.balance ?? 0),
                    },
                    {
                        label: 'Piutang',
                        value: (
                            <Box display="flex" alignItems="center">
                                {numberToCurrency(
                                    typedStatus.user?.unpaid_installments?.reduce(
                                        (acc, curr) => acc + curr.amount_rp,
                                        0,
                                    ) ?? 0,
                                )}

                                <IconButton
                                    title="Detail"
                                    color="primary"
                                    icon={ViewListIcon}
                                    onClick={() => setOpenPiutang(true)}
                                />

                                <Dialog
                                    open={openPiutang}
                                    maxWidth="sm"
                                    fullWidth
                                    onClose={() => setOpenPiutang(false)}>
                                    <DialogContent>
                                        <InstallmentTable
                                            data={
                                                typedStatus.user
                                                    ?.unpaid_installments ?? []
                                            }
                                        />
                                    </DialogContent>
                                </Dialog>
                            </Box>
                        ),
                    },
                ]}
            />

            <FormControl disabled={disabled} size="small">
                <FormLabel id="tx-radio-group">Jenis</FormLabel>

                <RadioGroup
                    row
                    aria-labelledby="tx-radio-group"
                    onChange={({ target: { value } }) =>
                        setFieldValue('type', value)
                    }>
                    <FormControlLabel
                        value="in"
                        required
                        control={<Radio size="small" />}
                        label="Masuk"
                    />

                    <FormControlLabel
                        value="out"
                        control={<Radio size="small" />}
                        label="Keluar"
                    />
                </RadioGroup>
            </FormControl>

            <DatePicker
                label="Tanggal"
                maxDate={dayjs().endOf('month')}
                disabled={disabled}
                onChange={value =>
                    setFieldValue('at', value?.format('YYYY-MM-DD'))
                }
            />

            <SelectFromApi
                required
                endpoint="/data/cashes2"
                label="Melalui Kas"
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
                    errors.from_cash_uuid ??
                    'Saldo: ' + numberToCurrency(fromCash?.balance ?? 0)
                }
            />

            <NumericFormat
                min="10000"
                disabled={disabled}
                label="Jumlah"
                InputProps={{
                    startAdornment: <RpInputAdornment />,
                }}
                onValueChange={({ floatValue }) =>
                    setFieldValue('amount', floatValue)
                }
                {...errorsToHelperTextObj(errors.amount)}
            />

            <Autocomplete
                disabled={disabled}
                options={[
                    TransactionTag.ARISAN,
                    TransactionTag.BENGKEL,
                    TransactionTag.EXCAVATOR,
                    TransactionTag.GAJIAN_TBS,
                    TransactionTag.KOREKSI,
                    TransactionTag.POTONGAN_JASA_PANEN,
                    TransactionTag.POTONGAN_JASA_PERAWATAN,
                    TransactionTag.TARIK_TUNAI,
                ]}
                onChange={(_, value) => setFieldValue('tag', value)}
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
                name="desc"
                label="Keterangan"
                multiline
                rows={2}
                disabled={disabled}
                component={TextFieldFastableComponent}
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
