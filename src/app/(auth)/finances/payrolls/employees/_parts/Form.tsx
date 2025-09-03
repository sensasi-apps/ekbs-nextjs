// vendors
import { FastField, type FastFieldProps, type FormikProps } from 'formik'
import dayjs from 'dayjs'
// materials
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
// components
import FormikForm from '@/components/formik-form'
import type Payroll from '@/types/orms/payroll'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import DatePicker from '@/components/DatePicker'
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
            id="product-purchase-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isSubmitting}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isSubmitting || isDisabled,
                },
            }}>
            <FastField name="at" label="Tanggal">
                {({
                    meta: { error, value },
                    form: { setFieldValue },
                }: FastFieldProps) => (
                    <DatePicker
                        value={value ? dayjs(value) : null}
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
                    />
                )}
            </FastField>

            <FastField name="type">
                {({ field }: FastFieldProps<string>) => (
                    <FormControl fullWidth margin="dense" size="small" required>
                        <InputLabel id="type-select-label">Jenis</InputLabel>
                        <Select
                            {...field}
                            value={field.value || ''}
                            required
                            label="Jenis"
                            disabled={isDisabled}
                            labelId="type-select-label"
                            id="type-select">
                            {[
                                'pengelola',
                                'pengurus',
                                'pengawas',
                                'pendiri',
                            ].map(type => (
                                <MenuItem value={type} key={type}>
                                    {ucWords(type)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </FastField>

            <FastField
                name="note"
                label="Nama/Catatan"
                disabled={isDisabled}
                multiline
                rows={3}
                component={TextFieldFastableComponent}
            />
        </FormikForm>
    )
}

type FormValues = Partial<Omit<Payroll, 'uuid'>>
