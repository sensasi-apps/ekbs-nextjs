// vendors

// materials
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import dayjs from 'dayjs'
import { FastField, type FastFieldProps, type FormikProps } from 'formik'
import DatePicker from '@/components/date-picker'
// components
import FormikForm from '@/components/formik-form'
import TextFieldFastableComponent from '@/components/text-field.fastable-component'
import type Payroll from '@/types/orms/payroll'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import ucWords from '@/utils/uc-words'

export default function FinancesPayrollsForm({
    dirty,
    isSubmitting,
}: FormikProps<FormValues>) {
    const isNew = false
    const isDisabled = isSubmitting
    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="product-purchase-form"
            isNew={isNew}
            processing={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isSubmitting || isDisabled,
                },
            }}
            submitting={isSubmitting}>
            <FastField label="Tanggal" name="at">
                {({
                    meta: { error, value },
                    form: { setFieldValue },
                }: FastFieldProps) => (
                    <DatePicker
                        disabled={isDisabled}
                        label="Tanggal"
                        onChange={date =>
                            setFieldValue(
                                'at',
                                date?.format('YYYY-MM-DD') || null,
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

            <FastField name="type">
                {({ field }: FastFieldProps<string>) => (
                    <FormControl fullWidth margin="dense" required size="small">
                        <InputLabel id="type-select-label">Jenis</InputLabel>
                        <Select
                            {...field}
                            disabled={isDisabled}
                            id="type-select"
                            label="Jenis"
                            labelId="type-select-label"
                            required
                            value={field.value || ''}>
                            {[
                                'pengelola',
                                'pengurus',
                                'pengawas',
                                'pendiri',
                            ].map(type => (
                                <MenuItem key={type} value={type}>
                                    {ucWords(type)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </FastField>

            <FastField
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Nama/Catatan"
                multiline
                name="note"
                rows={3}
            />
        </FormikForm>
    )
}

type FormValues = Partial<Omit<Payroll, 'uuid'>>
