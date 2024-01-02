// types
import type { Ymd } from '@/types/DateString'
import type { UUID } from 'crypto'
import type { FastFieldProps, FormikProps } from 'formik'
// vendors
import dayjs from 'dayjs'
import { FastField } from 'formik'
// materials
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/FormikForm'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
// uitls
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

export default function HeavyEquipmentRentFinishTaskForm({
    dirty,
    isSubmitting,
    values: { uuid, rate_unit = 'H.M', is_paid = false },
}: FormikProps<HerFinishTaskFormValues>) {
    const isPropcessing = isSubmitting
    const isDisabled = isPropcessing || is_paid

    return (
        <FormikForm
            id="heavy-equipment-rent-form"
            autoComplete="off"
            isNew={false}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
                cancelButton: {
                    children: 'Batal',
                },
            }}>
            <TextField
                label="Kode"
                value={uuid?.substr(uuid.length - 6).toUpperCase()}
                variant="filled"
                disabled={true}
            />

            <FastField name="finished_at" disabled={isDisabled}>
                {({
                    field: { value, name },
                    meta: { error },
                    form: { setFieldValue },
                }: FastFieldProps) => (
                    <DatePicker
                        value={value ? dayjs(value) : null}
                        maxDate={dayjs()}
                        disabled={isDisabled}
                        label="Tanggal Selesai"
                        onChange={date =>
                            setFieldValue(
                                name,
                                date ? date.format('YYYY-MM-DD') : null,
                            )
                        }
                        slotProps={{
                            textField: {
                                ...errorsToHelperTextObj(error),
                            },
                        }}
                    />
                )}
            </FastField>

            <Box display="inline-flex" gap={1}>
                <FastField name="start_hm" disabled={isDisabled}>
                    {({
                        field: { value, name },
                        meta: { error },
                        form: { setFieldValue },
                    }: FastFieldProps) => (
                        <NumericFormat
                            label="H.M Awal"
                            value={value}
                            name={name}
                            disabled={isDisabled}
                            onValueChange={({ floatValue }) =>
                                setFieldValue(name, floatValue)
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {rate_unit}
                                    </InputAdornment>
                                ),
                            }}
                            {...errorsToHelperTextObj(error)}
                        />
                    )}
                </FastField>

                <FastField name="end_hm" disabled={isDisabled}>
                    {({
                        field: { value, name },
                        meta: { error },
                        form: { setFieldValue },
                    }: FastFieldProps) => (
                        <NumericFormat
                            label="H.M Akhir"
                            value={value}
                            name={name}
                            disabled={isDisabled}
                            onValueChange={({ floatValue }) =>
                                setFieldValue(name, floatValue)
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {rate_unit}
                                    </InputAdornment>
                                ),
                            }}
                            {...errorsToHelperTextObj(error)}
                        />
                    )}
                </FastField>
            </Box>
        </FormikForm>
    )
}

export type HerFinishTaskFormValues = Partial<{
    uuid: UUID
    finished_at: Ymd
    start_hm: number
    end_hm: number
    rate_unit: 'H.M'
    is_paid: boolean
}>
