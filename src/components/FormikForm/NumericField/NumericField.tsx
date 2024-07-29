// vendors
import { Field, FieldProps } from 'formik'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
// components
import NumericFormat from '@/components/NumericFormat'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

type NumericFieldProps = {
    name: string
    label: string
    disabled: boolean
}

export default function NumericFormikField({
    name,
    ...restProps
}: NumericFieldProps) {
    return <Field name={name} component={InnerComponent} {...restProps} />
}

function InnerComponent({
    // formik props
    field: { name },
    form: { setFieldValue, getFieldMeta },

    // additional props
    disabled,
    label,
}: Omit<FieldProps<number>, 'meta'> & Omit<NumericFieldProps, 'name'>) {
    const { error, value } = getFieldMeta<number>(name)
    const [innerValue, setInnerValue] = useState<number | undefined>(value)

    const setFieldValueDebounced = useDebouncedCallback(
        (value?: number) => setFieldValue(name, value),
        250,
    )

    return (
        <NumericFormat
            id={name}
            value={innerValue}
            required
            min="1"
            onValueChange={({ floatValue }) => {
                setInnerValue(floatValue)
                setFieldValueDebounced(floatValue)
            }}
            {...errorsToHelperTextObj(error)}
            disabled={disabled}
            label={label}
        />
    )
}
