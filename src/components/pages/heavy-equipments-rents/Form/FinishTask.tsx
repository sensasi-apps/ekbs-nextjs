// types
import type RentItemRent from '@/dataTypes/RentItemRent'
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
// page components
import HerTaskDetail from '@/components/pages/heavy-equipments-rents/HerTaskDetail'
// uitls
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

export default function HeavyEquipmentRentFinishTaskForm({
    dirty,
    isSubmitting,
    values,
}: FormikProps<HerFinishTaskFormValues>) {
    const { short_uuid, rate_unit, is_paid = false } = values

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
                value={short_uuid}
                variant="filled"
                disabled={true}
            />

            <Box my={2}>
                <HerTaskDetail data={values as RentItemRent} />
            </Box>

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

            {rate_unit === 'H.M' && (
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
            )}
        </FormikForm>
    )
}

export type HerFinishTaskFormValues = Partial<
    RentItemRent & {
        start_hm: number
        end_hm: number
    }
>
