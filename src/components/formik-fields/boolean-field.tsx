'use client'

// materials
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Switch from '@mui/material/Switch'
// vendors
import { Field, type FieldProps } from 'formik'

interface BooleanFieldBaseProps {
    name: string
    label: string
    disabled?: boolean
}

type ShouldBeACheckboxOrSwitch =
    | {
          checkbox: boolean
          switch?: never
      }
    | {
          checkbox?: never
          switch: boolean
      }

export default function BooleanField(
    props: BooleanFieldBaseProps & ShouldBeACheckboxOrSwitch,
) {
    return <Field component={InnerComponent} {...props} />
}

function InnerComponent({
    // formik props
    field: { name },
    form: { setFieldValue, getFieldMeta, status, isSubmitting },

    // additional props
    label,
    disabled,
    checkbox,
}: Omit<FieldProps<boolean>, 'meta'> &
    Omit<BooleanFieldBaseProps, 'name'> &
    ShouldBeACheckboxOrSwitch) {
    const { error, value } = getFieldMeta<boolean>(name)

    const Control = checkbox ? Checkbox : Switch

    return (
        <FormControl margin="dense">
            <FormGroup>
                <FormControlLabel
                    control={
                        <Control
                            checked={value}
                            onChange={({ target: { checked } }) =>
                                setFieldValue(name, checked)
                            }
                        />
                    }
                    disabled={disabled || isSubmitting || status.isDisabled}
                    label={label}
                />

                <FormHelperText error={Boolean(error)}>{error}</FormHelperText>
            </FormGroup>
        </FormControl>
    )
}
