// types
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material'
// vendors
import { Field, FieldProps } from 'formik'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
// components
import DefaultTextField from '@/components/TextField'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

type TextFieldProps = {
    value?: string
    name: string
    label: string
    disabled: boolean
    textFieldProps?: Omit<
        MuiTextFieldProps,
        | 'error'
        | 'helperText'
        | 'name'
        | 'id'
        | 'disabled'
        | 'label'
        | 'value'
        | 'onChange'
    >
}

export default function TextField({ name }: TextFieldProps) {
    return <Field name={name} component={InnerComponent} />
}

function InnerComponent({
    // formik props
    field: { name },
    form: { setFieldValue, getFieldMeta },

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
            id={name}
            disabled={disabled}
            label={label}
            value={innerValue}
            onChange={({ target: { value } }) => {
                setInnerValue(value)
                debounceSetFieldValue(value)
            }}
            {...errorsToHelperTextObj(error)}
            {...textFieldProps}
        />
    )
}
