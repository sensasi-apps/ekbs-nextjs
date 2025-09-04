// types
import type { Transaction } from '@/dataTypes/Transaction'
import type FormType from '@/components/Global/Form/type'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
import type PalmBunchesReaPaymentDataType from '@/modules/palm-bunch/types/orms/palm-bunches-rea-payment'
// vendors
import React, { type ChangeEvent, useState } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/GridLegacy'
import Fade from '@mui/material/Fade'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableFooter from '@mui/material/TableFooter'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// icons
import AddIcon from '@mui/icons-material/Add'
import BackupTableIcon from '@mui/icons-material/BackupTable'
// components
import NumericFormat from '@/components/Global/NumericFormat'
import SelectFromApi from '@/components/Global/SelectFromApi'
import Text from '@/components/Global/Text'
import DatePicker from '@/components/DatePicker'
import toDmy from '@/utils/to-dmy'
// utils
import formatNumber from '@/utils/format-number'
import numberToCurrency from '@/utils/number-to-currency'
import fileDownload from 'js-file-download'

export default function PalmBuncesReaPaymentForm({
    data: dataProp = {} as PalmBunchesReaPaymentDataType,
    actionsSlot,
    loading,
    setSubmitting,
    onSubmitted,
}: FormType<PalmBunchesReaPaymentDataType>) {
    const hasTransactions = (dataProp?.transactions?.length || 0) > 0

    const [data, setData] = useState<PalmBunchesReaPaymentDataType>(dataProp)
    const [file, setFile] = useState<File>()
    const [isPaid, setIsPaid] = useState(hasTransactions)
    const [transactions, setTransactions] = useState(
        (data.transactions?.length > 0
            ? data.transactions.filter((_, i) => i > 0)
            : data.transaction_drafts?.map(tx => {
                  tx.amount = parseInt(tx.amount + '')

                  return tx
              })) || [],
    )
    const [validationErrors, setValidationErrors] = useState<
        LaravelValidationExceptionResponse['errors']
    >({})

    const {
        uuid,
        from_at,
        to_at,
        n_tickets,
        gross_rp,
        incentive_rp,
        deduction_rp,
        net_rp,
        excel_file,
    } = data

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formEl = e.target as HTMLFormElement
        if (!formEl.checkValidity()) return

        setSubmitting(true)

        const formData = new FormData(formEl)

        const paid_at = formData.get('paid_at') as string

        if (paid_at) {
            formData.set(
                'paid_at',
                dayjs(paid_at, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            )
        }

        transactions.forEach((transaction, index) => {
            formData.set(
                `transactions[${index}][amount]`,
                transaction.amount.toString(),
            )
        })

        return axios
            .post(
                `/palm-bunches/rea-payments${uuid ? '/' + uuid : ''}`,
                formData,
            )
            .then(() => onSubmitted())
            .catch(error => {
                setSubmitting(false)
                if (error.response?.status === 422) {
                    setValidationErrors(error.response.data.errors)
                } else {
                    throw error
                }
            })
            .finally(() => setSubmitting(false))
    }

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files

        if (files?.length === 0) return

        setSubmitting(true)

        const formData = new FormData()
        formData.append('excel_file', ev.target.files?.[0] as File)

        axios
            .post<PalmBunchesReaPaymentDataType>(
                `/palm-bunches/rea-payments/excel-parser${
                    uuid ? '/' + uuid : ''
                }`,
                formData,
            )
            .then(({ data }) => {
                setFile(ev.target.files?.[0])
                setData(data)
                setTransactions(data.transactions)
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    setValidationErrors(error.response.data.errors)
                } else {
                    throw error
                }
            })
            .finally(() => setSubmitting(false))
    }

    const clearValidationError1 = (ev: ChangeEvent<HTMLInputElement>) => {
        const { name } = ev.target

        if (validationErrors[name]) {
            setValidationErrors(prev => {
                delete prev[name]
                return prev
            })
        }
    }

    return (
        <form
            id="palm-bunches-rea-payment-form"
            autoComplete="off"
            onSubmit={handleSubmit}>
            <Grid container spacing={2} mb={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                    <Typography variant="caption">
                        <Button
                            onClick={() =>
                                axios
                                    .get<Blob>(
                                        `file/${excel_file?.uuid}.${excel_file?.extension}`,
                                        { responseType: 'blob' },
                                    )
                                    .then(res =>
                                        fileDownload(
                                            res.data,
                                            `${file?.name || excel_file?.alias}`,
                                        ),
                                    )
                            }
                            disabled={loading || !excel_file}
                            startIcon={<BackupTableIcon />}>
                            {file?.name || excel_file?.alias || (
                                <i>silakan unggah file excel</i>
                            )}
                        </Button>
                    </Typography>

                    {validationErrors?.excel_file && (
                        <FormHelperText error>
                            {validationErrors?.excel_file}
                        </FormHelperText>
                    )}
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Button
                        fullWidth
                        loading={loading}
                        disabled={loading || hasTransactions}
                        loadingPosition="start"
                        variant="contained"
                        color={file || excel_file ? 'warning' : 'success'}
                        size="small"
                        component="label"
                        startIcon={<BackupTableIcon />}>
                        {file || excel_file ? 'Ganti' : 'Pilih'} File
                        <input
                            accept=".xlsx"
                            type="file"
                            name="excel_file"
                            hidden
                            onChange={e => {
                                clearValidationError1(e)
                                handleFileChange(e)
                            }}
                        />
                    </Button>
                </Grid>
            </Grid>

            <Fade in={Boolean(file || excel_file)} unmountOnExit>
                <Box>
                    {from_at && to_at && (
                        <Text label="Rentang tanggal tiket:">
                            {toDmy(from_at)} - {toDmy(to_at)}
                        </Text>
                    )}

                    <Text label="Jumlah Tiket:" mb={2}>
                        {n_tickets && formatNumber(n_tickets)}
                    </Text>

                    <TableContainer>
                        <Table size="small">
                            <TableHead
                                sx={{
                                    '& th': {
                                        fontWeight: 'bold',
                                    },
                                }}>
                                <TableRow>
                                    <TableCell>Deskripsi</TableCell>
                                    <TableCell align="center">Nilai</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Nilai Kotor</TableCell>
                                    <TableCell align="right">
                                        {gross_rp && numberToCurrency(gross_rp)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Deduksi</TableCell>
                                    <TableCell align="right">
                                        {deduction_rp &&
                                            numberToCurrency(-deduction_rp)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Insentif</TableCell>
                                    <TableCell align="right">
                                        {incentive_rp &&
                                            numberToCurrency(incentive_rp)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        Nilai Bersih (sebelum pajak)
                                    </TableCell>
                                    <TableCell align="right">
                                        {net_rp && numberToCurrency(net_rp)}
                                    </TableCell>
                                </TableRow>

                                {transactions?.map((transaction, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                required
                                                variant="standard"
                                                size="small"
                                                disabled={
                                                    hasTransactions ||
                                                    loading ||
                                                    !(file || excel_file)
                                                }
                                                name={`transactions[${index}][desc]`}
                                                defaultValue={
                                                    transaction.desc || ''
                                                }
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                ) => {
                                                    const value =
                                                        event.target.value

                                                    transactions[index].desc =
                                                        value

                                                    setTransactions([
                                                        ...transactions,
                                                    ])
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell width="40%" padding="none">
                                            <TextField
                                                fullWidth
                                                disabled={
                                                    hasTransactions ||
                                                    loading ||
                                                    !(file || excel_file)
                                                }
                                                required
                                                size="small"
                                                name={`transactions[${index}][amount]`}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            Rp
                                                        </InputAdornment>
                                                    ),
                                                    inputComponent:
                                                        NumericFormat,
                                                }}
                                                inputProps={{
                                                    decimalScale: 4,
                                                    minLength: 1,
                                                    maxLength: 19,
                                                    onValueChange: ({
                                                        floatValue,
                                                    }: {
                                                        floatValue: number
                                                    }) => {
                                                        transactions[
                                                            index
                                                        ].amount = floatValue

                                                        setTransactions([
                                                            ...transactions,
                                                        ])
                                                    },
                                                    style: {
                                                        textAlign: 'right',
                                                    },
                                                }}
                                                onChange={clearValidationError1}
                                                value={transaction.amount || ''}
                                                defaultValue={
                                                    transaction.amount || ''
                                                }
                                                // error={Boolean(validationErrors[transaction.desc])}
                                                // helperText={validationErrors[transaction.desc]}
                                            />

                                            {index ===
                                                transactions.length - 1 && (
                                                <FormHelperText>
                                                    Gunakan tanda minus (-)
                                                    untuk mengindikasikan
                                                    pengeluaran
                                                </FormHelperText>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow
                                    sx={{
                                        '& td': {
                                            borderBottom: 'none',
                                            fontWeight: 'bold',
                                        },
                                    }}>
                                    <TableCell>Nilai Akhir</TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontSize: '1.1rem',
                                        }}>
                                        {numberToCurrency(
                                            transactions.reduce(
                                                (a, b) => a + (b.amount || 0),
                                                net_rp ?? 0,
                                            ),
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>

                    <Box mt={2} display="flex" justifyContent="space-between">
                        <FormGroup onChange={() => setIsPaid(prev => !prev)}>
                            <FormControlLabel
                                disabled={Boolean(loading || hasTransactions)}
                                control={
                                    <Checkbox
                                        defaultChecked={hasTransactions}
                                    />
                                }
                                label="Sudah Dibayar"
                            />
                        </FormGroup>

                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            disabled={loading || hasTransactions}
                            onClick={() => {
                                setTransactions(prev => [
                                    ...prev,
                                    {
                                        desc: '',
                                        amount: 0,
                                    } as Transaction,
                                ])
                            }}
                            startIcon={<AddIcon />}>
                            Biaya Lain
                        </Button>
                    </Box>

                    <Fade in={isPaid} unmountOnExit>
                        <Grid container mt={1} spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <SelectFromApi
                                    endpoint="/data/cashes"
                                    label="Ke kas"
                                    size="small"
                                    required
                                    defaultValue={
                                        dataProp.transactions?.[0]
                                            ?.cashable_uuid || ''
                                    }
                                    selectProps={{
                                        name: 'cash_uuid',
                                    }}
                                    margin="dense"
                                    onChange={({ target }) => {
                                        if (
                                            'name' in target &&
                                            validationErrors[target.name]
                                        ) {
                                            setValidationErrors(prev => {
                                                delete prev[target.name]
                                                return prev
                                            })
                                        }
                                    }}
                                    error={Boolean(validationErrors.cash_uuid)}
                                    helperText={validationErrors.cash_uuid}
                                    disabled={loading || hasTransactions}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    slotProps={{
                                        textField: {
                                            name: 'paid_at',
                                            label: 'Tanggal Bayar',
                                        },
                                    }}
                                    disabled={loading || hasTransactions}
                                    defaultValue={dayjs(
                                        dataProp.transactions?.[0]?.at,
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Fade>

                    <Fade in={!hasTransactions} unmountOnExit>
                        <Box>{actionsSlot}</Box>
                    </Fade>
                </Box>
            </Fade>
        </form>
    )
}
