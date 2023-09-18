import { FC, useState } from 'react'
import moment, { Moment } from 'moment'
import axios from '@/lib/axios'
import QueryString from 'qs'

import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'

import ValidationErrorsType from '@/types/ValidationErrors.type'
import PalmBunchDeliveryRateValidDateType from '@/types/PalmBunchDeliveryRateValidDate.type'

import DatePicker from '@/components/Global/DatePicker'
import NumericMasking from '@/components/Inputs/NumericMasking'
import FormType from '@/components/Global/Form/Form.type'

const oilMillCodes: readonly string[] = ['COM', 'POM', 'SOM']
const categories: readonly string[] = ['Atas', 'Bawah', 'Tengah']

const PalmBunchDeliveryRatesForm: FC<
    FormType<PalmBunchDeliveryRateValidDateType>
> = ({
    data: { id, valid_from, delivery_rates } = {},
    loading,
    actionsSlot,
    handleClose,
    setSubmitting,
}) => {
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrorsType>({})
    const [validFrom, setValidFrom] = useState<Moment | null>(
        valid_from ? moment(valid_from) : null,
    )

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (loading) return

        const formEl = e.currentTarget
        if (!formEl.checkValidity()) return

        setSubmitting(true)

        try {
            const formData = new FormData(formEl)
            const payload = Object.fromEntries(formData.entries())

            await axios.post(
                `/palm-bunches/delivery-rates${'/' + id || ''}`,
                QueryString.stringify(payload),
            )

            handleClose()
        } catch (error: any) {
            if (error.response.status !== 422) {
                throw error
            }

            setValidationErrors(error.response.data.errors)
            setSubmitting(false)
        }
    }

    const clearValidationErrors = (
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

    const weekOfMonths: number | null = validFrom
        ? validFrom?.weeks() - validFrom?.clone().startOf('month').weeks() + 1
        : null

    const getRpValue = (millCode: string, category: string) => {
        const deliveryRate = delivery_rates?.find(
            rate =>
                rate.to_oil_mill_code === millCode &&
                rate.from_position === category,
        )

        return deliveryRate?.rp_per_kg
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                    <DatePicker
                        shouldDisableDate={date => date?.day() !== 2}
                        disabled={loading}
                        defaultValue={valid_from}
                        slotProps={{
                            textField: {
                                required: true,
                                fullWidth: true,
                                name: 'valid_from',
                                label: 'Tanggal Berlaku',
                                margin: 'dense',
                                size: 'small',
                                error: Boolean(validationErrors.valid_from),
                                helperText: validationErrors.valid_from,
                            },
                        }}
                        onChange={value => {
                            setValidFrom(value)

                            if (validationErrors.valid_from) {
                                setValidationErrors(prev => {
                                    delete prev.valid_from
                                    return prev
                                })
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={6} sm={6}>
                    <DatePicker
                        readOnly
                        disabled={loading}
                        value={
                            validFrom ? moment(validFrom).add(6, 'days') : null
                        }
                        slotProps={{
                            textField: {
                                required: true,
                                fullWidth: true,
                                name: 'valid_until',
                                label: 'Hingga',
                                margin: 'dense',
                                size: 'small',
                                error: Boolean(validationErrors.valid_from),
                                helperText: validationErrors.valid_from,
                            },
                        }}
                    />
                </Grid>
            </Grid>

            <Fade in={Boolean(validFrom)} exit={false} unmountOnExit>
                <div>
                    <Typography
                        variant="h5"
                        component="div"
                        textAlign="center"
                        mt={4}>
                        {validFrom?.format('MMMM ')} #{weekOfMonths}{' '}
                        <Typography
                            variant="caption"
                            color="GrayText"
                            component="span">
                            ({validFrom?.year()})
                        </Typography>
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Pabrik</TableCell>
                                {categories.map(category => (
                                    <TableCell key={category}>
                                        {category}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {oilMillCodes.map(millCode => (
                                <TableRow key={millCode}>
                                    <TableCell>{millCode}</TableCell>
                                    {categories.map(category => (
                                        <TableCell key={millCode + category}>
                                            <TextField
                                                disabled={loading}
                                                fullWidth
                                                required
                                                margin="none"
                                                size="small"
                                                name={`rp_per_kgs[${millCode}][${category}]`}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            Rp
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            /kg
                                                        </InputAdornment>
                                                    ),
                                                    inputComponent:
                                                        NumericMasking,
                                                }}
                                                inputProps={{
                                                    decimalScale: 0,
                                                    minLength: 1,
                                                    maxLength: 5,
                                                }}
                                                onChange={clearValidationErrors}
                                                defaultValue={getRpValue(
                                                    millCode,
                                                    category,
                                                )}
                                                error={Boolean(
                                                    validationErrors[
                                                        `rp_per_kgs[${millCode}][${category}]`
                                                    ],
                                                )}
                                                helperText={
                                                    validationErrors[
                                                        `rp_per_kgs[${millCode}][${category}]`
                                                    ]
                                                }
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {actionsSlot}
                </div>
            </Fade>
        </form>
    )
}

export default PalmBunchDeliveryRatesForm
