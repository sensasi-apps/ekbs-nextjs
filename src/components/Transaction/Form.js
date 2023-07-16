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

import dmyToYmd from '@/lib/dmyToYmd'

export default function TransactionForm({
    data: transaction,
    handleClose = () => null,
}) {
    const {
        auth: { userHasPermission },
    } = useContext(AppContext)

    const isUserCanDelete = userHasPermission('transactions delete')

    const [validationErrors, setValidationErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [transactionType, setTransactionType] = useState(transaction?.type)

    if (!transaction) return null

    const handleSubmit = async e => {
        e.preventDefault()

        setIsSubmitting(true)

        const formData = new FormData(e.target)
        formData.set('at', dmyToYmd(formData.get('at')))

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

        setValidationErrors(prev => ({ ...prev, [name]: undefined }))
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
                label="Tanggal transaksi"
                margin="dense"
                disabled={isSubmitting || isDeleting}
                defaultValue={transaction?.at || new Date()}
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
                        defaultValue: transaction?.cash_uuid || '',
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
                                    ?.transaction_destination?.cash_uuid || '',
                        }}
                        error={Boolean(validationErrors.to_cash_uuid)}
                        helperText={validationErrors.to_cash_uuid}
                    />
                )}
            </Box>

            <TextField
                disabled={isSubmitting || isDeleting}
                fullWidth
                required
                margin="dense"
                name="amount"
                label="Jumlah"
                type="number"
                step="any"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">Rp</InputAdornment>
                    ),
                }}
                onChange={handleChange}
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

            <TextField
                fullWidth
                multiline
                rows={2}
                disabled={isSubmitting || isDeleting}
                margin="dense"
                name="note"
                label="Catatan"
                onChange={handleChange}
                defaultValue={transaction?.note}
                error={Boolean(validationErrors.note)}
                helperText={validationErrors.note}
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
