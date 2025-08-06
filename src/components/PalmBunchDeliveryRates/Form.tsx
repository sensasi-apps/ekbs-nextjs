// types
import type { ChangeEvent } from 'react'
import type FormType from '@/components/Global/Form/type'
import type { PalmBunchDeliveryRateType } from '@/dataTypes/PalmBunchDeliveryRate'
import type PalmBunchDeliveryRateValidDateType from '@/dataTypes/PalmBunchDeliveryRateValidDate'
import type { Ymd } from '@/types/DateString'
// vendors
import { useEffect, useState } from 'react'
// materials
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/GridLegacy'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
// components
import DatePicker from '@/components/DatePicker'
import NumericFormat from '@/components/Global/NumericFormat'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
// libs
import axios from '@/lib/axios'
import debounce from '@/utils/debounce'
import weekOfMonths from '@/utils/weekOfMonth'
import dayjs from 'dayjs'

const oilMillCodes: readonly string[] = ['COM', 'POM', 'SOM']
const categories: readonly string[] = ['Atas', 'Bawah', 'Tengah']
const emptyDeliveryRates: PalmBunchDeliveryRateType[] = oilMillCodes.reduce(
    (acc: PalmBunchDeliveryRateType[], millCode) => {
        categories.forEach(category => {
            acc.push({
                to_oil_mill_code: millCode,
                from_position: category,
                rp_per_kg: 0,
            })
        })

        return acc
    },
    [],
)

export default function PalmBunchDeliveryRatesForm({
    data,
    loading,
    actionsSlot,
    onSubmitted,
    setSubmitting,
    onChange,
}: FormType<PalmBunchDeliveryRateValidDateType>) {
    const { id, valid_from, delivery_rates } = data

    const { validationErrors, setValidationErrors, clearByEvent, clearByName } =
        useValidationErrors()
    const [validFrom, setValidFrom] = useState(
        valid_from ? dayjs(valid_from) : null,
    )
    const [deliveryRates, setDeliveryRates] = useState<
        PalmBunchDeliveryRateType[]
    >(structuredClone(delivery_rates || emptyDeliveryRates))

    useEffect(() => {
        setValidFrom(valid_from ? dayjs(valid_from) : null)
        setDeliveryRates(structuredClone(delivery_rates || emptyDeliveryRates))
    }, [valid_from, delivery_rates])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (loading || !validFrom) return

        const formEl = e.currentTarget
        if (!formEl.checkValidity()) return

        setSubmitting(true)

        const payload = {
            valid_from: validFrom.format(),
            valid_until: validFrom.clone().add(6, 'days').format(),
            delivery_rates: deliveryRates,
        } as PalmBunchDeliveryRateValidDateType

        return axios
            .post(`/palm-bunches/delivery-rates${id ? '/' + id : ''}`, payload)
            .then(() => onSubmitted(payload))
            .catch(error => {
                if (error?.response?.status !== 422) {
                    throw error
                }

                setValidationErrors(error.response.data.errors)
                setSubmitting(false)
            })
    }

    const getRpValue = (millCode: string, category: string) => {
        const deliveryRate = deliveryRates.find(
            rate =>
                rate.to_oil_mill_code === millCode &&
                rate.from_position === category,
        )

        return deliveryRate?.rp_per_kg || undefined
    }

    const setRate = (millCode: string, category: string, value: number) =>
        setDeliveryRates(prev => {
            const rateIndex = prev.findIndex(
                rate =>
                    rate.to_oil_mill_code === millCode &&
                    rate.from_position === category,
            )

            if (rateIndex === -1) return prev

            const newDeliveryRates = [...prev]

            newDeliveryRates[rateIndex].rp_per_kg = value

            return newDeliveryRates
        })

    const handleValuesChange = (event: ChangeEvent<HTMLInputElement>) => {
        clearByEvent(event)
        if (!onChange || !validFrom) return

        debounce(
            () =>
                onChange({
                    ...data,
                    delivery_rates: deliveryRates,
                    valid_from: validFrom.format('YYYY-MM-DD') as Ymd,
                    valid_until: validFrom
                        .clone()
                        .add(6, 'days')
                        .format('YYYY-MM-DD') as Ymd,
                }),
            200,
        )
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                    <DatePicker
                        shouldDisableDate={date => date?.day() !== 2}
                        disabled={loading}
                        value={validFrom}
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
                            clearByName('valid_until')
                        }}
                    />
                </Grid>

                <Grid item xs={6} sm={6}>
                    <DatePicker
                        readOnly
                        disabled={loading}
                        value={
                            validFrom ? validFrom.clone().add(6, 'days') : null
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
                        {validFrom?.format('MMMM ')} #
                        {validFrom && weekOfMonths(validFrom)}{' '}
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
                                                inputProps={{
                                                    decimalScale: 0,
                                                    minLength: 1,
                                                    maxLength: 5,
                                                    valueIsNumericString: false,
                                                    onValueChange: ({
                                                        floatValue,
                                                    }: {
                                                        floatValue: number
                                                    }) =>
                                                        setRate(
                                                            millCode,
                                                            category,
                                                            floatValue,
                                                        ),
                                                }}
                                                onChange={handleValuesChange}
                                                value={getRpValue(
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
                                                        NumericFormat,
                                                }}
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
