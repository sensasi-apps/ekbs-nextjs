// types
import type { Ymd } from '@/types/DateString'
import type { Mutate } from '../Datatable/@types'
import type { PalmBunchRateType } from '@/dataTypes/PalmBunchRate'
import type PalmBunchRateValidDateType from '@/types/orms/palm-bunch-rate-valid-date'
// vendors
import { useEffect, useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { NumericFormat } from 'react-number-format'
// materials
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/GridLegacy'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
// components
import DatePicker from '@/components/DatePicker'
import RpInputAdornment from '../InputAdornment/Rp'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
// libs
import axios from '@/lib/axios'
import debounce from '@/utils/debounce'
import useFormData from '@/providers/useFormData'
import FormActions from '../Global/Form/Actions'
import { dbPromise } from '@/lib/idb'
import errorCatcher from '@/utils/handle-422'
import weekOfMonths from '@/utils/week-of-month'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

const nameIdFormatter = (validFrom: Ymd) =>
    `${dayjs(validFrom).format('MMMM ')}#${weekOfMonths(validFrom)}`

const types = ['basic']
const getEmptyRates = () =>
    types.map(type => ({
        type,
    }))

let temp: PalmBunchRateValidDateType | undefined

export default function PalmBunchRatesForm({
    parentDatatableMutator,
}: {
    parentDatatableMutator: Mutate
}) {
    const { data, setData, loading, isDirty, handleClose, setSubmitting } =
        useFormData<PalmBunchRateValidDateType>()
    const { id, valid_from, rates } = data

    const { validationErrors, setValidationErrors, clearByName } =
        useValidationErrors()
    const [validFrom, setValidFrom] = useState(
        valid_from ? dayjs(valid_from) : null,
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

                    dbPromise.then(db =>
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
        <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                    <DatePicker
                        shouldDisableDate={date => date?.day() !== 2}
                        disabled={loading}
                        value={validFrom}
                        slotProps={{
                            textField: {
                                name: 'valid_from',
                                label: 'Tanggal Berlaku',
                                ...errorsToHelperTextObj(
                                    validationErrors.valid_from,
                                ),
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
                                    startAdornment: <RpInputAdornment />,
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
