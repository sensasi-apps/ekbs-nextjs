// types

// materials
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
// vendors
import dayjs from 'dayjs'
import type { FastFieldProps, FormikProps } from 'formik'
import { FastField } from 'formik'
// page components
import HerTaskDetail from '@/app/(auth)/heavy-equipment-rents/_parts/her-task-detail'
// components
import DatePicker from '@/components/date-picker'
import FormikForm from '@/components/formik-form'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import type RentItemRent from '@/types/orms/rent-item-rent'
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
            autoComplete="off"
            dirty={dirty}
            id="heavy-equipment-rent-form"
            isNew={false}
            processing={isPropcessing}
            slotProps={{
                cancelButton: {
                    children: 'Batal',
                },
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            <TextField
                disabled={true}
                label="Kode"
                value={short_uuid}
                variant="filled"
            />

            <Box my={2}>
                <HerTaskDetail data={values as RentItemRent} />
            </Box>

            <FastField disabled={isDisabled} name="finished_at">
                {({
                    field: { value, name },
                    meta: { error },
                    form: { setFieldValue },
                }: FastFieldProps) => (
                    <DatePicker
                        disabled={isDisabled}
                        label="Tanggal Selesai"
                        maxDate={dayjs()}
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
                        value={value ? dayjs(value) : null}
                    />
                )}
            </FastField>

            {rate_unit === 'H.M' && (
                <Box display="inline-flex" gap={1}>
                    <FastField disabled={isDisabled} name="start_hm">
                        {({
                            field: { value, name },
                            meta: { error },
                            form: { setFieldValue },
                        }: FastFieldProps) => (
                            <NumericFormat
                                disabled={isDisabled}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {rate_unit}
                                        </InputAdornment>
                                    ),
                                }}
                                label="H.M Awal"
                                name={name}
                                onValueChange={({ floatValue }) =>
                                    setFieldValue(name, floatValue)
                                }
                                value={value}
                                {...errorsToHelperTextObj(error)}
                            />
                        )}
                    </FastField>

                    <FastField disabled={isDisabled} name="end_hm">
                        {({
                            field: { value, name },
                            meta: { error },
                            form: { setFieldValue },
                        }: FastFieldProps) => (
                            <NumericFormat
                                disabled={isDisabled}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {rate_unit}
                                        </InputAdornment>
                                    ),
                                }}
                                label="H.M Akhir"
                                name={name}
                                onValueChange={({ floatValue }) =>
                                    setFieldValue(name, floatValue)
                                }
                                value={value}
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
