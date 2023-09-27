import React, { FC, useState } from 'react'
import moment from 'moment'
import axios from '@/lib/axios'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
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
import LoadingButton from '@mui/lab/LoadingButton'

import AddIcon from '@mui/icons-material/Add'
import BackupTableIcon from '@mui/icons-material/BackupTable'

import ValidationErrorsType from '@/types/ValidationErrors.type'
import PalmBunchesReaPaymentDataType from '@/dataTypes/PalmBunchesReaPayment'
import FormType from '@/components/Global/Form/type'
import NumericFormat from '@/components/Global/NumericFormat'
import TransactionDataType from '@/dataTypes/Transaction'

import SelectFromApi from '@/components/Global/SelectFromApi'
import Text from '@/components/Global/Text'
import DatePicker from '@/components/Global/DatePicker'

const PalmBuncesReaPaymentForm: FC<FormType<PalmBunchesReaPaymentDataType>> = ({
    data: dataProp = {} as PalmBunchesReaPaymentDataType,
    actionsSlot,
    loading,
    setSubmitting,
    onSubmitted,
}) => {
    if (dataProp?.from_at && !moment.isMoment(dataProp.from_at)) {
        dataProp.from_at = moment(dataProp.from_at)
    }

    if (dataProp?.to_at && !moment.isMoment(dataProp.to_at)) {
        dataProp.to_at = moment(dataProp.to_at)
    }

    const hasTransactions = (dataProp?.transactions?.length || 0) > 0

    const [data, setData] = useState<PalmBunchesReaPaymentDataType>(dataProp)
    const [file, setFile] = useState<File>()
    const [isPaid, setIsPaid] = useState(hasTransactions)
    const [transactions, setTransactions] = useState(
        data.transactions.length > 0
            ? data.transactions.filter((_, i) => i > 0)
            : data.transaction_drafts.map(tx => {
                  tx.amount = parseInt(tx.amount + '')

                  return tx
              }) || [],
    )
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrorsType>({})

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

        try {
            const formData = new FormData(formEl)

            transactions.forEach((transaction, index) => {
                formData.set(
                    `transactions[${index}][amount]`,
                    parseFloat(transaction.amount + '') as any,
                )
            })

            await axios.post(
                `/palm-bunches/rea-payments${uuid ? '/' + uuid : ''}`,
                formData,
            )

            onSubmitted()
        } catch (error: any) {
            setSubmitting(false)
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setSubmitting(false)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (files?.length === 0) return

        setSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('excel_file', e.target.files?.[0] as File)
            const data = await axios
                .post(
                    `/palm-bunches/rea-payments/excel-parser${
                        uuid ? '/' + uuid : ''
                    }`,
                    formData,
                )
                .then(res => res.data)

            data.from_at = moment(data.from_at)
            data.to_at = moment(data.to_at)

            setFile(e.target.files?.[0])
            setData(data as PalmBunchesReaPaymentDataType)
            setTransactions(data.transactions)
        } catch (error: any) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                setSubmitting(false)
                throw error
            }
        }

        setSubmitting(false)
    }

    const clearValidationError = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name } = event.target

        if (validationErrors[name]) {
            setValidationErrors(prev => {
                delete prev[name]
                return prev
            })
        }
    }

    const fileUrl = excel_file
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${excel_file?.uuid}.${excel_file?.extension}`
        : '#'

    return (
        <form
            id="palm-bunches-rea-payment-form"
            autoComplete="off"
            onSubmit={handleSubmit}>
            <Grid container spacing={2} mb={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                    <Typography variant="caption">
                        <Button
                            disabled={loading || !Boolean(excel_file)}
                            target="_blank"
                            href={fileUrl}
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
                    <LoadingButton
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
                                clearValidationError(e)
                                handleFileChange(e)
                            }}
                        />
                    </LoadingButton>
                </Grid>
            </Grid>

            <Fade in={Boolean(file || excel_file)} unmountOnExit>
                <Box>
                    <Text label="Rentang tanggal tiket:">
                        {from_at?.format('DD MMMM YYYY')} -{' '}
                        {to_at?.format('DD MMMM YYYY')}
                    </Text>

                    <Text label="Jumlah Tiket:" mb={2}>
                        <NumericFormat
                            value={n_tickets}
                            suffix=" Tiket"
                            displayType="text"
                            decimalScale={4}
                        />
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
                                        <NumericFormat
                                            value={gross_rp}
                                            prefix="Rp. "
                                            displayType="text"
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Deduksi</TableCell>
                                    <TableCell align="right">
                                        <NumericFormat
                                            value={deduction_rp}
                                            prefix="Rp. "
                                            displayType="text"
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Insentif</TableCell>
                                    <TableCell align="right">
                                        <NumericFormat
                                            value={incentive_rp}
                                            prefix="Rp. "
                                            displayType="text"
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        Nilai Bersih (sebelum pajak)
                                    </TableCell>
                                    <TableCell align="right">
                                        <NumericFormat
                                            value={net_rp}
                                            prefix="Rp. "
                                            displayType="text"
                                        />
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
                                                    !Boolean(file || excel_file)
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
                                                    !Boolean(file || excel_file)
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
                                                        NumericFormat as any,
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
                                                onChange={clearValidationError}
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
                                    <TableCell align="right">
                                        <NumericFormat
                                            value={transactions.reduce(
                                                (a, b) => a + (b.amount || 0),
                                                net_rp,
                                            )}
                                            prefix="Rp. "
                                            displayType="text"
                                            style={{ fontSize: '1.1rem' }}
                                        />
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
                                    } as TransactionDataType,
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
                                        dataProp.transactions?.[0]?.cash.uuid ||
                                        ''
                                    }
                                    selectProps={{
                                        name: 'cash_uuid',
                                    }}
                                    onChange={clearValidationError}
                                    error={Boolean(validationErrors.cash_uuid)}
                                    helperText={validationErrors.cash_uuid}
                                    disabled={loading || hasTransactions}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            name: 'paid_at',
                                            label: 'Tanggal Bayar',
                                            required: true,
                                        },
                                    }}
                                    disabled={loading || hasTransactions}
                                    defaultValue={
                                        dataProp.transactions?.[0]?.at ||
                                        moment()
                                    }
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

export default PalmBuncesReaPaymentForm
