'use client'

// vendors
import { Field, type FieldProps } from 'formik'
import { useDebouncedCallback } from 'use-debounce'
// components
import NumericFormat, {
    type NumericFormatProps,
} from '@/components/numeric-format'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

interface NumericFieldProps {
    name: string
    label?: string
    disabled?: boolean
    numericFormatProps?: Omit<NumericFormatProps, 'name' | 'label' | 'disabled'>
}

export default function NumericField({
    name,
    ...restProps
}: NumericFieldProps) {
    return <Field component={InnerComponent} name={name} {...restProps} />
}

/**
 * InnerComponent is a functional component that integrates with Formik to handle numeric input fields.
 * It uses a debounced callback to update the Formik field value, minimizing the number of updates.
 */
function InnerComponent({
    // formik props
    field: { name },
    form: { setFieldValue, getFieldMeta, isSubmitting },

    // additional props
    disabled,
    label,
    numericFormatProps,
}: Omit<FieldProps<number>, 'meta'> & Omit<NumericFieldProps, 'name'>) {
    const { error, value } = getFieldMeta<number | undefined>(name)

    const setFieldValueDebounced = useDebouncedCallback(
        (value?: number) => setFieldValue(name, value),
        250,
    )

    return (
        <NumericFormat
            disabled={disabled || isSubmitting}
            id={name}
            label={label}
            min="1"
            onValueChange={({ floatValue }) => {
                setFieldValueDebounced(floatValue)
            }}
            required
            value={value === undefined ? '' : value}
            {...numericFormatProps}
            {...errorsToHelperTextObj(error)}
        />
    )
}
