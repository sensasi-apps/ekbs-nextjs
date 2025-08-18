'use client'

// vendors
import { Field, type FieldProps } from 'formik'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
// components
import NumericFormat, {
    type NumericFormatProps,
} from '@/components/NumericFormat'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

interface NumericFieldProps {
    name: string
    label?: string
    disabled: boolean
    numericFormatProps?: Omit<NumericFormatProps, 'name' | 'label' | 'disabled'>
}

export default function NumericFormikField({
    name,
    ...restProps
}: NumericFieldProps) {
    return <Field name={name} component={InnerComponent} {...restProps} />
}

/**
 * InnerComponent is a functional component that integrates with Formik to handle numeric input fields.
 * It uses a debounced callback to update the Formik field value, minimizing the number of updates.
 *
 * @bug The `value` prop is not being updated when the field value changes.
 */
function InnerComponent({
    // formik props
    field: { name, value },
    form: { setFieldValue, getFieldMeta },

    // additional props
    disabled,
    label,
    numericFormatProps,
}: Omit<FieldProps<number>, 'meta'> & Omit<NumericFieldProps, 'name'>) {
    const { error } = getFieldMeta<number>(name)
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
            disabled={disabled}
            label={label}
            {...numericFormatProps}
            {...errorsToHelperTextObj(error)}
        />
    )
}
