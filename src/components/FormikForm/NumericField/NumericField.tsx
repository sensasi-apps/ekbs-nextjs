// vendors
import { Field, FieldProps } from 'formik'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
// components
import NumericFormat, { NumericFormatProps } from '@/components/NumericFormat'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

type NumericFieldProps = {
    name: string
    label: string
    disabled: boolean
    numericFormatProps?: Omit<NumericFormatProps, 'name' | 'label' | 'disabled'>
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
    numericFormatProps,
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
            disabled={disabled}
            label={label}
            {...numericFormatProps}
            {...errorsToHelperTextObj(error)}
        />
    )
}
