import { mutate } from 'swr'
import { useContext, useState } from 'react'

import axios from '@/lib/axios'

import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'

import LoadingButton from '@mui/lab/LoadingButton'

import AppContext from '@/providers/App'
import SelectInputFromApi from '../SelectInputFromApi'
import DatePicker from '../DatePicker'

import NumericMasking from '../Inputs/NumericMasking'
import moment from 'moment'

export default function TransactionForm({
    data: transaction,
    handleClose = () => null,
}) {
    const {
        auth: { userHasPermission },
    } = useContext(AppContext)

    const [validationErrors, setValidationErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [transactionType, setTransactionType] = useState(transaction?.type)

    if (!transaction) return null

    const isUserCanDelete = userHasPermission('transactions delete')

    let atMoment = moment(transaction?.at)

    const handleSubmit = async e => {
        e.preventDefault()

        setIsSubmitting(true)

        const formData = new FormData(e.target)
        formData.set('at', atMoment)

        try {
            if (transaction?.uuid) {
                formData.append('_method', 'PUT')
                await axios.post(`transactions/${transaction.uuid}`, formData)
            } else {
                await axios.post('transactions', formData)
            }

            await mutate(`transactions`)
            await mutate(`data/cashes`)

            handleClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsSubmitting(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            await axios.delete(`/transactions/${transaction.uuid}`)
            await mutate(`transactions`)
            await mutate(`data/cashes`)

            handleClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsDeleting(false)
    }

    const handleChange = e => {
        const { name } = e.target

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {transaction?.uuid && (
                <TextField
                    disabled
                    fullWidth
                    id="uuid"
                    margin="dense"
                    variant="filled"
                    label="Kode Transaksi"
                    defaultValue={transaction?.uuid || ''}
                />
            )}

            <FormControl
                margin="dense"
                required
                disabled={isSubmitting || isDeleting}>
                <FormLabel id="type">Jenis Transaksi</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="type"
                    name="type"
                    onChange={e => setTransactionType(e.target.value)}
                    value={transactionType || ''}>
                    <FormControlLabel
                        value="income"
                        control={<Radio required />}
                        label="Masuk"
                    />
                    <FormControlLabel
                        value="expense"
                        control={<Radio />}
                        label="Keluar"
                    />
                    <FormControlLabel
                        value="transfer"
                        control={<Radio />}
                        label="Transfer"
                    />
                </RadioGroup>
            </FormControl>

            <DatePicker
                name="at"
                required
                label="Tanggal"
                margin="dense"
                disabled={isSubmitting || isDeleting}
                onChange={date => (atMoment = date)}
                defaultValue={atMoment}
                fullWidth
                error={Boolean(validationErrors.at)}
                helperText={validationErrors.at}
            />

            <Box display="flex" gap={1}>
                <SelectInputFromApi
                    endpoint="data/cashes"
                    label={transactionType === 'income' ? 'Ke Kas' : 'Dari Kas'}
                    name="cash_uuid"
                    disabled={isSubmitting || isDeleting}
                    margin="dense"
                    required
                    selectProps={{
                        defaultValue: transaction?.cashable_uuid || '',
                    }}
                    error={Boolean(validationErrors.cash_uuid)}
                    helperText={validationErrors.cash_uuid}
                />

                {transactionType === 'transfer' && (
                    <SelectInputFromApi
                        endpoint="data/cashes"
                        label="Ke Kas"
                        name="to_cash_uuid"
                        disabled={isSubmitting || isDeleting}
                        margin="dense"
                        required
                        selectProps={{
                            defaultValue:
                                transaction?.cash_transfer_origin
                                    ?.transaction_destination?.cashable_uuid ||
                                '',
                        }}
                        error={Boolean(validationErrors.to_cash_uuid)}
                        helperText={validationErrors.to_cash_uuid}
                    />
                )}
            </Box>

            <input type="hidden" id="amount" name="amount" />

            <TextField
                disabled={isSubmitting || isDeleting}
                fullWidth
                required
                margin="dense"
                label="Jumlah"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">Rp</InputAdornment>
                    ),
                    inputComponent: NumericMasking,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 1,
                    maxLength: 19,
                }}
                onChange={e => {
                    const { value } = e.target
                    document.getElementById('amount').value = value
                    return handleChange(e)
                }}
                defaultValue={
                    transaction?.amount < 0
                        ? -transaction?.amount
                        : transaction?.amount || ''
                }
                error={Boolean(validationErrors.amount)}
                helperText={validationErrors.amount}
            />

            <TextField
                fullWidth
                multiline
                disabled={isSubmitting || isDeleting}
                required
                rows={2}
                margin="dense"
                name="desc"
                label="Deskripsi"
                onChange={handleChange}
                defaultValue={transaction?.desc}
                error={Boolean(validationErrors.desc)}
                helperText={validationErrors.desc}
            />

            <Box
                mt={2}
                display="flex"
                justifyContent={
                    transaction?.uuid && isUserCanDelete
                        ? 'space-between'
                        : 'end'
                }>
                {transaction?.uuid && isUserCanDelete && (
                    <LoadingButton
                        onClick={handleDelete}
                        variant="outlined"
                        color="error"
                        loading={isDeleting}
                        disabled={isSubmitting}
                        startIcon={<DeleteIcon />}>
                        Hapus
                    </LoadingButton>
                )}

                <Box>
                    <Button
                        type="reset"
                        disabled={isSubmitting || isDeleting}
                        onClick={handleClose}>
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={isDeleting}>
                        Simpan
                    </LoadingButton>
                </Box>
            </Box>
        </form>
    )
}
