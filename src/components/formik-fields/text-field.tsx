'use client'

// types
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
// vendors
import { Field, type FieldProps } from 'formik'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
// components
import DefaultTextField from '@/components/TextField'

interface TextFieldProps {
    value?: string
    name: string
    label?: string
    disabled?: boolean
    textFieldProps?: Omit<
        MuiTextFieldProps,
        'error' | 'name' | 'id' | 'disabled' | 'label' | 'value' | 'onChange'
    >
}

export default function TextField(props: TextFieldProps) {
    return <Field component={InnerComponent} {...props} />
}

function InnerComponent({
    // formik props
    field: { name },
    form: { setFieldValue, getFieldMeta, isSubmitting },

    // additional props
    label,
    disabled,
    textFieldProps,
    value: valueProp,
}: Omit<FieldProps<string>, 'meta'> & Omit<TextFieldProps, 'name'>) {
    const { error, value } = getFieldMeta<string>(name)
    const [innerValue, setInnerValue] = useState(valueProp ?? value ?? '')

    const debounceSetFieldValue = useDebouncedCallback(
        (value?: string) => setFieldValue(name, value ?? ''),
        250,
    )

    return (
        <DefaultTextField
            disabled={disabled || isSubmitting}
            id={name}
            label={label}
            onChange={({ target: { value } }) => {
                setInnerValue(value)
                debounceSetFieldValue(value)
            }}
            value={innerValue}
            {...textFieldProps}
            error={Boolean(error)}
            helperText={error ?? textFieldProps?.helperText}
        />
    )
}
