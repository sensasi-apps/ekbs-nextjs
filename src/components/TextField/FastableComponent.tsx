// types
import type { FieldProps } from 'formik'
import type { TextFieldProps } from '@mui/material/TextField'
// vendors
import { useCallback, useEffect, useState } from 'react'
// components
import TextField from '@/components/TextField'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
// utils
import debounce from '@/utils/debounce'

/**
 * A component that renders a text input field with fastable functionality.
 * @param field - The field object containing the input field's name, value, and onChange function.
 * @param form - The form object containing the form's errors.
 * @param props - Additional props to be passed to the TextField component.
 * @returns A TextField component with fastable functionality.
 */
export default function TextFieldFastableComponent({
    field: { onChange, name, value },
    form: { errors },
    ...props
}: FieldProps & TextFieldProps) {
    const [innerValue, setInnerValue] = useState('')

    useEffect(() => {
        if (value && value !== innerValue) {
            setInnerValue(value as string)
        }
    }, [value, innerValue])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist()

            setInnerValue(e.target.value)
            debounce(() => onChange(e))
        },
        [onChange],
    )

    return (
        <TextField
            name={name}
            onChange={handleChange}
            value={innerValue}
            {...errorsToHelperTextObj(errors[name])}
            {...props}
        />
    )
}
