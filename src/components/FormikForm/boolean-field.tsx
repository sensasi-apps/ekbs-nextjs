// vendors
import { Field, FieldProps } from 'formik'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
// materials
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Switch from '@mui/material/Switch'

type BooleanFieldProps = {
    name: string
    label: string
    disabled: boolean
} & (
    | {
          checkbox: boolean
          switch?: never
      }
    | {
          checkbox?: never
          switch: boolean
      }
)

export function BooleanField(props: BooleanFieldProps) {
    return <Field component={InnerComponent} {...props} />
}

function InnerComponent({
    // formik props
    field: { name },
    form: { setFieldValue, getFieldMeta },

    // additional props
    label,
    disabled,
    checkbox,
}: Omit<FieldProps<boolean>, 'meta'> & Omit<BooleanFieldProps, 'name'>) {
    const { error, value } = getFieldMeta<boolean>(name)
    const [innerValue, setInnerValue] = useState(value)

    const debounceSetFieldValue = useDebouncedCallback(
        (value: boolean) => setFieldValue(name, value),
        250,
    )

    const Control = checkbox ? Checkbox : Switch

    return (
        <FormControl margin="dense">
            <FormGroup>
                <FormControlLabel
                    control={
                        <Control
                            checked={innerValue}
                            onChange={({ target: { checked } }) => {
                                setInnerValue(checked)
                                debounceSetFieldValue(checked)
                            }}
                        />
                    }
                    label={label}
                    disabled={disabled}
                />

                <FormHelperText error={Boolean(error)}>{error}</FormHelperText>
            </FormGroup>
        </FormControl>
    )
}
