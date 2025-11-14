// vendors

// icons
import LockIcon from '@mui/icons-material/Lock'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
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
import dayjs from 'dayjs'
import { useState } from 'react'
import DatePicker from '@/components/date-picker'
import SelectFromApi from '@/components/Global/SelectFromApi'
import InfoBox from '@/components/info-box'
import RpInputAdornment from '@/components/input-adornments/rp'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import axios from '@/lib/axios'
import type { Ymd } from '@/types/date-string'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import type CashType from '@/types/orms/cash'
import type Payroll from '@/types/orms/payroll'
// components
import type { PayrollType } from '@/types/orms/payroll'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
import ucWords from '@/utils/uc-words'
import FinanceApiUrlEnum from '../../../../_enums/api-url'

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
                    cash_uuid: cashUuid,
                    cost_shares: costShares?.map(costShare => ({
                        deduction_rp: costShare.deduction_rp,
                        uuid: costShare.uuid,
                    })),
                    general_deduction_rp: generalRpDeduction,
                    is_final: isFinal,
                    note,
                    type,
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
                    value={at ? dayjs(at) : null}
                />

                <FormControl fullWidth margin="dense" required size="small">
                    <InputLabel id="type-select-label">Jenis</InputLabel>
                    <Select
                        disabled={isDisabled}
                        id="type-select"
                        label="Jenis"
                        labelId="type-select-label"
                        name="type"
                        onChange={({ target }) =>
                            setType(target.value as PayrollType)
                        }
                        required
                        value={type}>
                        {['pengelola', 'pengurus', 'pengawas', 'pendiri'].map(
                            type => (
                                <MenuItem key={type} value={type}>
                                    {ucWords(type)}
                                </MenuItem>
                            ),
                        )}
                    </Select>
                </FormControl>

                <TextField
                    defaultValue={note}
                    disabled={isDisabled}
                    label="Catatan"
                    multiline
                    name="note"
                    onChange={({ target: { value } }) =>
                        debounce(() => setNote(value))
                    }
                    rows={2}
                    {...errorsToHelperTextObj(errors?.note)}
                />

                <SelectFromApi
                    disabled={isDisabled}
                    endpoint="/data/cashes"
                    label="Telah Dibayar Dari Kas"
                    margin="dense"
                    onValueChange={({ uuid }: CashType) => setCashUuid(uuid)}
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
                    required={isFinal}
                    selectProps={{
                        name: 'cash_uuid',
                        value: cashUuid ?? '',
                    }}
                    size="small"
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
                    InputProps={{
                        startAdornment: <RpInputAdornment />,
                    }}
                    onValueChange={({ floatValue }) =>
                        setGeneralRpDeduction(floatValue ?? 0)
                    }
                    value={generalRpDeduction}
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
                                <TableRow key={costShare.uuid}>
                                    <TableCell>
                                        {costShare.business_unit?.name}
                                    </TableCell>
                                    <TableCell>
                                        <NumericFormat
                                            disabled={isDisabled}
                                            InputProps={{
                                                startAdornment: (
                                                    <RpInputAdornment />
                                                ),
                                            }}
                                            margin="none"
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
                                            value={costShare.deduction_rp}
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
                    <FormHelperText component="div" error>
                        {Object.values(errors).map(error => (
                            <Box key={error.join('')}>{error}</Box>
                        ))}
                    </FormHelperText>
                )}

                <FormGroup
                    sx={{
                        mt: 2,
                    }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isFinal}
                                onChange={({ target: { checked } }) =>
                                    setIsFinal(checked)
                                }
                            />
                        }
                        disabled={isDisabled}
                        label="Simpan Permanen"
                        sx={{
                            maxWidth: 'fit-content',
                        }}
                    />
                </FormGroup>

                <Box display="flex" gap={1.5} justifyContent="end">
                    <Button
                        color={isFinal ? 'warning' : 'info'}
                        disabled={loading}
                        onClick={handleClose}
                        size="small">
                        {data.processed_at ? 'Tutup' : 'Batal'}
                    </Button>

                    <Button
                        color={isFinal ? 'warning' : 'info'}
                        disabled={isDisabled}
                        loading={loading}
                        onClick={handleSubmit}
                        size="small"
                        startIcon={isFinal ? <LockIcon /> : undefined}
                        variant="contained">
                        {isFinal ? 'Proses Penggajian' : 'Simpan'}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
