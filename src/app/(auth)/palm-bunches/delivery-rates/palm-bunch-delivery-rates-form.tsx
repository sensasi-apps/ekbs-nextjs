// materials
import Fade from '@mui/material/Fade'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
// vendors
import dayjs from 'dayjs'
import { type FormikProps } from 'formik'
import { Activity, useEffect, useEffectEvent } from 'react'
// components
import FlexBox from '@/components/flex-box'
import DateField from '@/components/formik-fields/date-field'
import NumericField from '@/components/formik-fields/numeric-field'
import FormikForm from '@/components/formik-form-v2'
import RpInputAdornment from '@/components/input-adornments/rp'
import TextField from '@/components/text-field'
import type PalmBunchDeliveryRateValidDateType from '@/modules/palm-bunch/types/orms/palm-bunch-delivery-rate-valid-date'
import weekOfMonths from '@/utils/week-of-month'

const oilMillCodes = ['COM', 'POM', 'SOM'] as const
const categories = ['Atas', 'Bawah', 'Tengah'] as const

const indexMap = oilMillCodes.reduce(
    (accMill, millCode, millIdx) => {
        categories.forEach((category, categoryIdx) => {
            accMill[`${millCode}-${category}`] =
                millIdx * categories.length + categoryIdx
        })

        return accMill
    },
    {} as { [key: string]: number },
)

export default function PalmBunchDeliveryRatesForm({
    values,
    isSubmitting,
    setFieldValue,
}: FormikProps<PalmBunchDeliveryRateValidDateType>) {
    const { valid_from, valid_until } = values

    const validFrom = valid_from ? dayjs(valid_from) : null

    const _setFieldValue = useEffectEvent(setFieldValue)

    useEffect(() => {
        if (validFrom) {
            const validUntil = validFrom.add(6, 'day').endOf('day').toDate()

            _setFieldValue('valid_until', validUntil)
        }
    }, [validFrom])

    return (
        <FormikForm>
            <FlexBox>
                <DateField
                    datePickerProps={{
                        shouldDisableDate: date => date?.day() !== 2,
                    }}
                    disabled={isSubmitting}
                    label="Tanggal Berlaku"
                    name="valid_from"
                />

                <TextField
                    disabled
                    label="Hingga"
                    name="valid_until"
                    value={
                        valid_until
                            ? dayjs(valid_until).format('DD-MM-YYYY')
                            : ''
                    }
                />
            </FlexBox>

            <Activity mode={Boolean(validFrom) ? 'visible' : 'hidden'}>
                <Fade in={true}>
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
                                            <NumericFieldCell
                                                category={category}
                                                key={millCode + category}
                                                millCode={millCode}
                                            />
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Fade>
            </Activity>
        </FormikForm>
    )
}

function NumericFieldCell({
    millCode,
    category,
}: {
    millCode: string
    category: string
}) {
    return (
        <TableCell>
            <NumericField
                label=""
                name={`delivery_rates.${indexMap[`${millCode}-${category}`]}.rp_per_kg`}
                numericFormatProps={{
                    margin: 'none',
                    slotProps: {
                        htmlInput: {
                            maxLength: 5,
                            minLength: 1,
                        },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    /kg
                                </InputAdornment>
                            ),
                            startAdornment: <RpInputAdornment />,
                        },
                    },
                }}
            />
        </TableCell>
    )
}
