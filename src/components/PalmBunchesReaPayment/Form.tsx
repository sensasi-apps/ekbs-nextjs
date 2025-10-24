// types

// icons
import AddIcon from '@mui/icons-material/Add'
import BackupTableIcon from '@mui/icons-material/BackupTable'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Fade from '@mui/material/Fade'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/GridLegacy'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import fileDownload from 'js-file-download'
// vendors
import React, { type ChangeEvent, useState } from 'react'
import DatePicker from '@/components/DatePicker'
import type FormType from '@/components/Global/Form/type'
// components
import NumericFormat from '@/components/Global/NumericFormat'
import SelectFromApi from '@/components/Global/SelectFromApi'
import Text from '@/components/Global/Text'
import axios from '@/lib/axios'
import type PalmBunchesReaPaymentDataType from '@/modules/palm-bunch/types/orms/palm-bunches-rea-payment'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
// utils
import formatNumber from '@/utils/format-number'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'

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
            autoComplete="off"
            id="palm-bunches-rea-payment-form"
            onSubmit={handleSubmit}>
            <Grid alignItems="center" container mb={2} spacing={2}>
                <Grid item sm={8} xs={12}>
                    <Typography variant="caption">
                        <Button
                            disabled={loading || !excel_file}
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

                <Grid item sm={4} xs={12}>
                    <Button
                        color={file || excel_file ? 'warning' : 'success'}
                        component="label"
                        disabled={loading || hasTransactions}
                        fullWidth
                        loading={loading}
                        loadingPosition="start"
                        size="small"
                        startIcon={<BackupTableIcon />}
                        variant="contained">
                        {file || excel_file ? 'Ganti' : 'Pilih'} File
                        <input
                            accept=".xlsx"
                            hidden
                            name="excel_file"
                            onChange={e => {
                                clearValidationError1(e)
                                handleFileChange(e)
                            }}
                            type="file"
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
                                                defaultValue={
                                                    transaction.desc || ''
                                                }
                                                disabled={
                                                    hasTransactions ||
                                                    loading ||
                                                    !(file || excel_file)
                                                }
                                                fullWidth
                                                name={`transactions[${index}][desc]`}
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
                                                required
                                                size="small"
                                                variant="standard"
                                            />
                                        </TableCell>

                                        <TableCell padding="none" width="40%">
                                            <TextField
                                                defaultValue={
                                                    transaction.amount || ''
                                                }
                                                disabled={
                                                    hasTransactions ||
                                                    loading ||
                                                    !(file || excel_file)
                                                }
                                                fullWidth
                                                InputProps={{
                                                    inputComponent:
                                                        NumericFormat,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            Rp
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    decimalScale: 4,
                                                    maxLength: 19,
                                                    minLength: 1,
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
                                                name={`transactions[${index}][amount]`}
                                                onChange={clearValidationError1}
                                                required
                                                size="small"
                                                value={transaction.amount || ''}
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

                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <FormGroup onChange={() => setIsPaid(prev => !prev)}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        defaultChecked={hasTransactions}
                                    />
                                }
                                disabled={Boolean(loading || hasTransactions)}
                                label="Sudah Dibayar"
                            />
                        </FormGroup>

                        <Button
                            color="success"
                            disabled={loading || hasTransactions}
                            onClick={() => {
                                setTransactions(prev => [
                                    ...prev,
                                    {
                                        amount: 0,
                                        desc: '',
                                    } as TransactionORM,
                                ])
                            }}
                            size="small"
                            startIcon={<AddIcon />}
                            variant="outlined">
                            Biaya Lain
                        </Button>
                    </Box>

                    <Fade in={isPaid} unmountOnExit>
                        <Grid container mt={1} spacing={2}>
                            <Grid item sm={6} xs={12}>
                                <SelectFromApi
                                    defaultValue={
                                        dataProp.transactions?.[0]
                                            ?.cashable_uuid || ''
                                    }
                                    disabled={loading || hasTransactions}
                                    endpoint="/data/cashes"
                                    error={Boolean(validationErrors.cash_uuid)}
                                    helperText={validationErrors.cash_uuid}
                                    label="Ke kas"
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
                                    required
                                    selectProps={{
                                        name: 'cash_uuid',
                                    }}
                                    size="small"
                                />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <DatePicker
                                    defaultValue={dayjs(
                                        dataProp.transactions?.[0]?.at,
                                    )}
                                    disabled={loading || hasTransactions}
                                    slotProps={{
                                        textField: {
                                            label: 'Tanggal Bayar',
                                            name: 'paid_at',
                                        },
                                    }}
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
