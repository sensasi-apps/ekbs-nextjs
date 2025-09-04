// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
// icons
import LockIcon from '@mui/icons-material/Lock'
// components
import type { PayrollType } from '@/types/orms/payroll'
import type { Ymd } from '@/types/date-string'
import type CashType from '@/types/orms/cash'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import type Payroll from '@/types/orms/payroll'
import DatePicker from '@/components/DatePicker'
import InfoBox from '@/components/InfoBox'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextField from '@/components/TextField'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'
import handle422 from '@/utils/handle-422'
import FinanceApiUrlEnum from '../../../../_enums/api-url'
import ucWords from '@/utils/uc-words'

const SX_NOWRAP = { whiteSpace: 'nowrap' }

export default function ProcessPayrollForm({
    data,
    handleClose,
    mutate,
}: {
    data: Payroll
    handleClose: () => void
    mutate: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [at, setAt] = useState(data.at)
    const [type, setType] = useState(data.type)
    const [note, setNote] = useState(data.note)
    const [cashUuid, setCashUuid] = useState<string>(data.cash_uuid as string)
    const [isFinal, setIsFinal] = useState(Boolean(data.processed_at))
    const [costShares, setCostShares] = useState(data.cost_shares)
    const [generalRpDeduction, setGeneralRpDeduction] = useState(
        data.general_deduction_rp ?? 0,
    )

    const [errors, setErrors] = useState<LaravelValidationException['errors']>()

    async function handleSubmit() {
        setLoading(true)

        return axios
            .post(
                FinanceApiUrlEnum.PROCESS_PAYROLL.replace('$uuid', data.uuid),
                {
                    at,
                    type,
                    note,
                    cash_uuid: cashUuid,
                    is_final: isFinal,
                    cost_shares: costShares?.map(costShare => ({
                        uuid: costShare.uuid,
                        deduction_rp: costShare.deduction_rp,
                    })),
                    general_deduction_rp: generalRpDeduction,
                },
            )
            .then(() => {
                mutate()
                handleClose()
            })
            .catch(err => handle422(err, setErrors))
            .finally(() => setLoading(false))
    }

    const isDisabled = loading || Boolean(data.processed_at)

    return (
        <Grid container spacing={4}>
            <Grid size={{ md: 4 }}>
                <Typography mb={1}>Rincian Penggajian:</Typography>

                <DatePicker
                    value={at ? dayjs(at) : null}
                    disabled={isDisabled}
                    label="Tanggal"
                    onChange={date =>
                        debounce(() => setAt(date?.format('YYYY-MM-DD') as Ymd))
                    }
                    slotProps={{
                        textField: {
                            ...errorsToHelperTextObj(errors?.at),
                        },
                    }}
                />

                <FormControl fullWidth margin="dense" size="small" required>
                    <InputLabel id="type-select-label">Jenis</InputLabel>
                    <Select
                        value={type}
                        name="type"
                        required
                        label="Jenis"
                        disabled={isDisabled}
                        labelId="type-select-label"
                        id="type-select"
                        onChange={({ target }) =>
                            setType(target.value as PayrollType)
                        }>
                        {['pengelola', 'pengurus', 'pengawas', 'pendiri'].map(
                            type => (
                                <MenuItem value={type} key={type}>
                                    {ucWords(type)}
                                </MenuItem>
                            ),
                        )}
                    </Select>
                </FormControl>

                <TextField
                    multiline
                    name="note"
                    label="Catatan"
                    disabled={isDisabled}
                    rows={2}
                    defaultValue={note}
                    onChange={({ target: { value } }) =>
                        debounce(() => setNote(value))
                    }
                    {...errorsToHelperTextObj(errors?.note)}
                />

                <SelectFromApi
                    required={isFinal}
                    endpoint="/data/cashes"
                    label="Telah Dibayar Dari Kas"
                    size="small"
                    margin="dense"
                    disabled={isDisabled}
                    selectProps={{
                        value: cashUuid ?? '',
                        name: 'cash_uuid',
                    }}
                    onValueChange={({ uuid }: CashType) => setCashUuid(uuid)}
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
                    {...errorsToHelperTextObj(errors?.cash_uuid)}
                />

                <Box mt={2}>
                    <InfoBox
                        data={[
                            {
                                label: 'Total Gaji Kotor',
                                value: numberToCurrency(
                                    data?.earning_rp_cache ?? 0,
                                ),
                            },
                            {
                                label: 'Potongan',
                                value: numberToCurrency(
                                    data?.deduction_rp_cache ?? 0,
                                ),
                            },
                            {
                                label: 'Total Bersih',
                                value: numberToCurrency(
                                    data?.final_rp_cache ?? 0,
                                ),
                            },
                        ]}
                    />
                </Box>
            </Grid>

            <Grid size={{ md: 8 }}>
                <Typography>Beban Umum:</Typography>

                <NumericFormat
                    disabled={isDisabled}
                    value={generalRpDeduction}
                    onValueChange={({ floatValue }) =>
                        setGeneralRpDeduction(floatValue ?? 0)
                    }
                    InputProps={{
                        startAdornment: <RpInputAdornment />,
                    }}
                    {...errorsToHelperTextObj(errors?.general_deduction_rp)}
                />

                <Typography mt={4}>Beban Unit Bisnis:</Typography>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Unit Bisnis</TableCell>
                                <TableCell>Beban Kotor</TableCell>
                                <TableCell>Penerimaan Unit</TableCell>
                                <TableCell>Beban Bersih</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {costShares?.map((costShare, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {costShare.business_unit?.name}
                                    </TableCell>
                                    <TableCell>
                                        <NumericFormat
                                            disabled={isDisabled}
                                            value={costShare.deduction_rp}
                                            onValueChange={({ floatValue }) =>
                                                setCostShares(prev =>
                                                    prev?.map(
                                                        (prevCostShare, j) =>
                                                            i === j
                                                                ? {
                                                                      ...prevCostShare,
                                                                      deduction_rp:
                                                                          floatValue ??
                                                                          0,
                                                                  }
                                                                : prevCostShare,
                                                    ),
                                                )
                                            }
                                            margin="none"
                                            InputProps={{
                                                startAdornment: (
                                                    <RpInputAdornment />
                                                ),
                                            }}
                                            {...errorsToHelperTextObj(
                                                errors?.[
                                                    `cost_shares.${i}.deduction_rp`
                                                ],
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell sx={SX_NOWRAP}>
                                        {numberToCurrency(costShare.earning_rp)}
                                    </TableCell>
                                    <TableCell sx={SX_NOWRAP}>
                                        {numberToCurrency(
                                            costShare.deduction_rp -
                                                costShare.earning_rp,
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell sx={SX_NOWRAP}>
                                    {numberToCurrency(
                                        (costShares?.reduce(
                                            (acc, costShare) =>
                                                acc + costShare.deduction_rp,
                                            0,
                                        ) ?? 0) + generalRpDeduction,
                                    )}
                                </TableCell>
                                <TableCell sx={SX_NOWRAP}>
                                    {numberToCurrency(
                                        costShares?.reduce(
                                            (acc, costShare) =>
                                                acc + costShare.earning_rp,
                                            0,
                                        ) ?? 0,
                                    )}
                                </TableCell>
                                <TableCell>
                                    {numberToCurrency(
                                        costShares?.reduce(
                                            (acc, costShare) =>
                                                acc +
                                                costShare.deduction_rp -
                                                costShare.earning_rp,
                                            0,
                                        ) ?? 0,
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>

                {errors && (
                    <FormHelperText error component="div">
                        {Object.values(errors).map((error, i) => (
                            <Box key={i}>{error}</Box>
                        ))}
                    </FormHelperText>
                )}

                <FormGroup
                    sx={{
                        mt: 2,
                    }}>
                    <FormControlLabel
                        disabled={isDisabled}
                        sx={{
                            maxWidth: 'fit-content',
                        }}
                        control={
                            <Checkbox
                                checked={isFinal}
                                onChange={({ target: { checked } }) =>
                                    setIsFinal(checked)
                                }
                            />
                        }
                        label="Simpan Permanen"
                    />
                </FormGroup>

                <Box display="flex" justifyContent="end" gap={1.5}>
                    <Button
                        size="small"
                        color={isFinal ? 'warning' : 'info'}
                        disabled={loading}
                        onClick={handleClose}>
                        {data.processed_at ? 'Tutup' : 'Batal'}
                    </Button>

                    <Button
                        size="small"
                        color={isFinal ? 'warning' : 'info'}
                        variant="contained"
                        startIcon={isFinal ? <LockIcon /> : undefined}
                        disabled={isDisabled}
                        loading={loading}
                        onClick={handleSubmit}>
                        {isFinal ? 'Proses Penggajian' : 'Simpan'}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
