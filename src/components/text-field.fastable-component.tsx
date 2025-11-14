// types

import type { TextFieldProps } from '@mui/material/TextField'
import type { FieldProps } from 'formik'
// vendors
import { useCallback, useState } from 'react'
// components
import TextField from '@/components/text-field'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

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
    const [innerValue, setInnerValue] = useState(value ?? '')

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist()

            setInnerValue(e.target.value)

            debounce(() => {
                onChange(e)
            })
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
