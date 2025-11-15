// materials
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/GridLegacy'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// vendors
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
// components
import type { Mutate } from '@/components/Datatable/@types'
import DatePicker from '@/components/date-picker'
import FormActions from '@/components/Global/Form/Actions'
import RpInputAdornment from '@/components/input-adornments/rp'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
// libs
import axios from '@/lib/axios'
import dbPromise from '@/lib/db-promise'
// modules
import type PalmBunchRateORM from '@/modules/palm-bunch/types/orms/palm-bunch-rate'
import type PalmBunchRateValidDateORM from '@/modules/palm-bunch/types/orms/palm-bunch-rate-valid-date'
// providers
import useFormData from '@/providers/useFormData'
// types
import type { Ymd } from '@/types/date-string'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import errorCatcher from '@/utils/handle-422'
import weekOfMonths from '@/utils/week-of-month'

const nameIdFormatter = (validFrom: Ymd) =>
    `${dayjs(validFrom).format('MMMM ')}#${weekOfMonths(validFrom)}`

const types = ['basic']
const getEmptyRates = () =>
    types.map(type => ({
        type,
    }))

let temp: PalmBunchRateValidDateORM | undefined

export default function PalmBunchRatesForm({
    parentDatatableMutator,
}: {
    parentDatatableMutator: Mutate
}) {
    const { data, setData, loading, isDirty, handleClose, setSubmitting } =
        useFormData<PalmBunchRateValidDateORM>()
    const { id, valid_from, rates } = data

    const { validationErrors, setValidationErrors, clearByName } =
        useValidationErrors()
    const [validFrom, setValidFrom] = useState(
        valid_from ? dayjs(valid_from) : null,
    )
    const [ratesState, setRatesState] = useState<PalmBunchRateORM[]>(
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
    }, [data])

    useEffect(() => {
        setValidFrom(valid_from ? dayjs(valid_from) : null)
        setRatesState(
            rates ||
                types.map(type => ({
                    type,
                })),
        )
    }, [valid_from, rates])

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

                    dbPromise?.then(db =>
                        db
                            .getKeyFromIndex('formDataDrafts', 'nameId', [
                                'PalmBunchRateValidDate',
                                nameIdFormatter(temp?.valid_from as Ymd),
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

    const handleDateChange = (date: Dayjs | null) => {
        clearByName('valid_from')

        if (!date || temp === undefined) return

        temp.valid_from = date.format('YYYY-MM-DD') as Ymd
        temp.valid_until = date
            .clone()
            .add(6, 'days')
            .format('YYYY-MM-DD') as Ymd

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
        <form autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item sm={6} xs={6}>
                    <DatePicker
                        disabled={loading}
                        onChange={handleDateChange}
                        shouldDisableDate={date => date?.day() !== 2}
                        slotProps={{
                            textField: {
                                label: 'Tanggal Berlaku',
                                name: 'valid_from',
                                ...errorsToHelperTextObj(
                                    validationErrors.valid_from,
                                ),
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

                    {ratesState &&
                        ratesState.map(rate => (
                            <NumericFormat
                                allowNegative={false}
                                customInput={TextField}
                                decimalScale={0}
                                decimalSeparator=","
                                disabled={loading}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            /kg
                                        </InputAdornment>
                                    ),
                                    startAdornment: <RpInputAdornment />,
                                }}
                                inputProps={{
                                    maxLength: 5,
                                    minLength: 3,
                                }}
                                key={rate.type}
                                label="Harga"
                                margin="dense"
                                name={`rates[${rate.type}]`}
                                onValueChange={values =>
                                    handleRateChange(
                                        rate.type,
                                        values.floatValue,
                                    )
                                }
                                required
                                thousandSeparator="."
                                value={rate.rp_per_kg}
                                {...errorsToHelperTextObj(
                                    validationErrors[
                                        `rp_per_kgs[${rate.type}]`
                                    ],
                                )}
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
