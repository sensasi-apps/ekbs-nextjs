// types

// materials
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/GridLegacy'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { ChangeEvent } from 'react'
// vendors
import { useEffect, useState } from 'react'
// components
import DatePicker from '@/components/DatePicker'
import type FormType from '@/components/Global/Form/type'
import NumericFormat from '@/components/Global/NumericFormat'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
// libs
import axios from '@/lib/axios'
import type PalmBunchDeliveryRateType from '@/modules/palm-bunch/types/orms/palm-bunch-delivery-rate'
import type PalmBunchDeliveryRateValidDateType from '@/modules/palm-bunch/types/orms/palm-bunch-delivery-rate-valid-date'
import type { Ymd } from '@/types/date-string'
import debounce from '@/utils/debounce'
import weekOfMonths from '@/utils/week-of-month'

const oilMillCodes: readonly string[] = ['COM', 'POM', 'SOM']
const categories: readonly string[] = ['Atas', 'Bawah', 'Tengah']
const emptyDeliveryRates: PalmBunchDeliveryRateType[] = oilMillCodes.reduce(
    (acc: PalmBunchDeliveryRateType[], millCode) => {
        categories.forEach(category => {
            acc.push({
                from_position: category,
                rp_per_kg: 0,
                to_oil_mill_code: millCode,
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
            delivery_rates: deliveryRates,
            valid_from: validFrom.format(),
            valid_until: validFrom.clone().add(6, 'days').format(),
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
        <form autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item sm={6} xs={6}>
                    <DatePicker
                        disabled={loading}
                        onChange={value => {
                            setValidFrom(value)
                            clearByName('valid_until')
                        }}
                        shouldDisableDate={date => date?.day() !== 2}
                        slotProps={{
                            textField: {
                                error: Boolean(validationErrors.valid_from),
                                fullWidth: true,
                                helperText: validationErrors.valid_from,
                                label: 'Tanggal Berlaku',
                                margin: 'dense',
                                name: 'valid_from',
                                required: true,
                                size: 'small',
                            },
                        }}
                        value={validFrom}
                    />
                </Grid>

                <Grid item sm={6} xs={6}>
                    <DatePicker
                        disabled={loading}
                        readOnly
                        slotProps={{
                            textField: {
                                error: Boolean(validationErrors.valid_from),
                                fullWidth: true,
                                helperText: validationErrors.valid_from,
                                label: 'Hingga',
                                margin: 'dense',
                                name: 'valid_until',
                                required: true,
                                size: 'small',
                            },
                        }}
                        value={
                            validFrom ? validFrom.clone().add(6, 'days') : null
                        }
                    />
                </Grid>
            </Grid>

            <Fade exit={false} in={Boolean(validFrom)} unmountOnExit>
                <div>
                    <Typography
                        component="div"
                        mt={4}
                        textAlign="center"
                        variant="h5">
                        {validFrom?.format('MMMM ')} #
                        {validFrom && weekOfMonths(validFrom)}{' '}
                        <Typography
                            color="GrayText"
                            component="span"
                            variant="caption">
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
                                                error={Boolean(
                                                    validationErrors[
                                                        `rp_per_kgs[${millCode}][${category}]`
                                                    ],
                                                )}
                                                fullWidth
                                                helperText={
                                                    validationErrors[
                                                        `rp_per_kgs[${millCode}][${category}]`
                                                    ]
                                                }
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            /kg
                                                        </InputAdornment>
                                                    ),
                                                    inputComponent:
                                                        NumericFormat,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            Rp
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    decimalScale: 0,
                                                    maxLength: 5,
                                                    minLength: 1,
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
                                                    valueIsNumericString: false,
                                                }}
                                                margin="none"
                                                onChange={handleValuesChange}
                                                required
                                                size="small"
                                                value={getRpValue(
                                                    millCode,
                                                    category,
                                                )}
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
