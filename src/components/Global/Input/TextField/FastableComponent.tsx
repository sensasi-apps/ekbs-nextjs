// types
import type { FastFieldProps } from 'formik'
import type { TextFieldProps } from '@mui/material/TextField'
// vendors
import { useCallback, useEffect, useState } from 'react'
import TextField from '@/components/Global/Input/TextField'

let timeout: NodeJS.Timeout
const debounce = (fn: () => void, ms = 300) => {
    clearTimeout(timeout)
    timeout = setTimeout(fn, ms)
}

export default function TextFieldFastableComponent({
    field,
    form: { errors },
    ...props
}: FastFieldProps & TextFieldProps) {
    const [innerValue, setInnerValue] = useState('')

    useEffect(() => {
        if (field.value && field.value !== innerValue) {
            setInnerValue(field.value as string)
        }
    }, [field.value])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist()

            setInnerValue(e.target.value)
            debounce(() => {
                field.onChange(e)
            })
        },
        [],
    )

    return (
        <TextField
            error={Boolean(errors[field.name])}
            helperText={errors[field.name] as string}
            {...field}
            {...props}
            onChange={handleChange}
            value={innerValue}
        />
    )
}
