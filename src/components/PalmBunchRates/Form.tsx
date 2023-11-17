import type { Moment } from 'moment'
import type PalmBunchRateType from '@/dataTypes/PalmBunchRate'
import type PalmBunchRateValidDateType from '@/dataTypes/PalmBunchRateValidDate'
import type { KeyedMutator } from 'swr'

import { FC, useEffect, useState } from 'react'
import moment from 'moment'
import { NumericFormat } from 'react-number-format'

import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
// components
import DatePicker from '@/components/Global/DatePicker'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
// libs
import axios from '@/lib/axios'
import debounce from '@/utils/debounce'
import errorCatcher from '@/utils/errorCatcher'
import useFormData from '@/providers/useFormData'
import weekOfMonths from '@/lib/weekOfMonth'
import FormActions from '../Global/Form/Actions'
import { dbPromise } from '@/lib/idb'

const nameIdFormatter = (validFrom: string) => {
    const momentValue = moment(validFrom)

    return `${momentValue.format('MMMM ')}#${weekOfMonths(momentValue)}`
}

const types = ['basic']
const getEmptyRates = () =>
    types.map(type => ({
        type,
    }))

let temp: PalmBunchRateValidDateType | undefined

const PalmBunchRatesForm: FC<{
    parentDatatableMutator: KeyedMutator<any>
}> = ({ parentDatatableMutator }) => {
    const { data, setData, loading, isDirty, handleClose, setSubmitting } =
        useFormData<PalmBunchRateValidDateType>()
    const { id, valid_from, rates } = data

    const { validationErrors, setValidationErrors, clearByName } =
        useValidationErrors()
    const [validFrom, setValidFrom] = useState<Moment | null>(
        valid_from ? moment(valid_from) : null,
    )
    const [ratesState, setRatesState] = useState<PalmBunchRateType[]>(
        rates ??
            types.map(type => ({
                type: type,
            })),
    )

    useEffect(() => {
        temp = structuredClone(data)
        return () => {
            temp = undefined
        }
    }, [])

    useEffect(() => {
        setValidFrom(valid_from ? moment(valid_from) : null)
        setRatesState(
            rates ||
                types.map(type => ({
                    type,
                })),
        )
    }, [data])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (loading || !validFrom) return

        const formEl = e.currentTarget
        if (!formEl.checkValidity()) return

        setSubmitting(true)

        return axios
            .post(`/palm-bunches/rates${id ? '/' + id : ''}`, temp)
            .then(() => {
                handleClose()

                parentDatatableMutator().then(() => {
                    if (temp?.valid_from === undefined) {
                        return
                    }

                    dbPromise.then(db =>
                        db
                            .getKeyFromIndex('formDataDrafts', 'nameId', [
                                'PalmBunchRateValidDate',
                                nameIdFormatter(temp?.valid_from as string),
                            ])
                            .then(id =>
                                id ? db.delete('formDataDrafts', id) : null,
                            ),
                    )
                })
            })
            .catch(error => errorCatcher(error, setValidationErrors))
            .finally(() => setSubmitting(false))
    }

    const getRateIndexByKey = (key: string) =>
        temp?.rates?.findIndex(rate => rate.type === key)

    const handleRateChange = (key: string, value: number | undefined) => {
        clearByName(key)

        if (!validFrom || !temp) return

        if (!temp.rates) {
            temp.rates = getEmptyRates()
        }

        const rateIndex = getRateIndexByKey(key)

        if (rateIndex === undefined) {
            return
        }

        temp.rates[rateIndex].rp_per_kg = value
        debounceSetData()
    }

    const handleDateChange = (date: Moment | null) => {
        clearByName('valid_from')

        if (!date || temp === undefined) return

        temp.valid_from = date.format()
        temp.valid_until = date.clone().add(6, 'days').format()

        debounceSetData()
    }

    const debounceSetData = () =>
        debounce(
            () =>
                setData({
                    ...temp,
                }),
            300,
        )

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
                        onChange={handleDateChange}
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

                    {ratesState &&
                        ratesState.map(rate => (
                            <NumericFormat
                                key={rate.type}
                                margin="dense"
                                label="Harga"
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
                                }}
                                inputProps={{
                                    minLength: 3,
                                    maxLength: 5,
                                }}
                                required
                                fullWidth
                                thousandSeparator="."
                                decimalSeparator=","
                                allowNegative={false}
                                decimalScale={0}
                                customInput={TextField}
                                disabled={loading}
                                value={rate.rp_per_kg}
                                name={`rates[${rate.type}]`}
                                onValueChange={values =>
                                    handleRateChange(
                                        rate.type,
                                        values.floatValue,
                                    )
                                }
                                error={Boolean(
                                    validationErrors[`rates[${rate.type}]`],
                                )}
                                helperText={
                                    validationErrors[`rates[${rate.type}]`]
                                }
                            />
                        ))}

                    <FormActions
                        disabled={loading}
                        onCancel={() => {
                            if (
                                isDirty &&
                                !window.confirm(
                                    'Perubahan belum tersimpan, yakin ingin membatalkan?',
                                )
                            ) {
                                return
                            }

                            return handleClose()
                        }}
                    />
                </div>
            </Fade>
        </form>
    )
}

export default PalmBunchRatesForm
