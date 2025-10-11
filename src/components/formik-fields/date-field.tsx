'use client'

import type { TextFieldProps } from '@mui/material/TextField'
import dayjs from 'dayjs'
// vendors
import { Field, type FieldProps } from 'formik'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
// components
import DatePicker, { type DatePickerProps } from '@/components/DatePicker'
// types
import type { Ymd } from '@/types/date-string'
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
    return <Field component={InnerComponent} name={name} {...restProps} />
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
            disabled={disabled || isSubmitting}
            disableFuture
            label={label}
            name={name}
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
            value={innerValue ? dayjs(innerValue) : null}
            {...datePickerProps}
        />
    )
}
