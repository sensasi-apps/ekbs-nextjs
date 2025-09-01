'use client'

// types
import type { Ymd } from '@/types/DateString'
import type { TextFieldProps } from '@mui/material/TextField'
// vendors
import { Field, type FieldProps } from 'formik'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import dayjs from 'dayjs'
// components
import DatePicker, { type DatePickerProps } from '@/components/DatePicker'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

type DateFieldProps = {
    name: string
    label: string
    disabled?: boolean
    datePickerProps?: Omit<
        DatePickerProps,
        'name' | 'disabled' | 'label' | 'slotProps' | 'value' | 'onChange'
    >
    textFieldProps?: Omit<
        TextFieldProps,
        'error' | 'name' | 'id' | 'disabled' | 'label'
    >
}

export default function DateField({ name, ...restProps }: DateFieldProps) {
    return <Field name={name} component={InnerComponent} {...restProps} />
}

function InnerComponent({
    // formik props
    field: { name },
    form: { setFieldValue, getFieldMeta, isSubmitting },

    // additional props
    disabled,
    label,
    datePickerProps,
    textFieldProps,
}: Omit<FieldProps<Ymd>, 'meta'> & Omit<DateFieldProps, 'name'>) {
    const { error, value } = getFieldMeta<Ymd>(name)
    const [innerValue, setInnerValue] = useState<Ymd | undefined>(value)

    const debounceSetFieldValue = useDebouncedCallback(
        (value?: Ymd) => setFieldValue(name, value),
        250,
    )

    return (
        <DatePicker
            disableFuture
            disabled={disabled || isSubmitting}
            name={name}
            label={label}
            value={innerValue ? dayjs(innerValue) : null}
            onChange={date => {
                const value = date
                    ? (date.format('YYYY-MM-DD') as Ymd)
                    : undefined

                setInnerValue(value)
                debounceSetFieldValue(value)
            }}
            slotProps={{
                textField: {
                    id: name,
                    ...errorsToHelperTextObj(error),
                    ...textFieldProps,
                },
            }}
            {...datePickerProps}
        />
    )
}
