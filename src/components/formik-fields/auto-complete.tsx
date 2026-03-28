import VendorComponent, {
    type AutocompleteProps as VendorProps,
} from '@mui/material/Autocomplete'
import { Field, useFormikContext } from 'formik'
import TextField, { type TextFieldProps } from '@/components/text-field'

type TType =
    | {
          id: number | string
          label: string
      }
    | string

export default function AutoComplete<
    T extends TType,
    Multiple extends boolean,
>({
    defaultValue,
    name,
    options,
    placeholder,
    required,
    slotProps,
    ...props
}: AutocompleteProps<T, Multiple>) {
    const { errors, isSubmitting, setFieldValue, getFieldMeta } =
        useFormikContext()
    const typedErrors = errors as Record<string, string>
    const { value } = getFieldMeta<Multiple extends true ? T[] : T>(name)

    const isOptionsEmpty = options.length === 0
    const error = !!typedErrors[name] || isOptionsEmpty
    const helperText =
        typedErrors[name] ?? (isOptionsEmpty ? 'Tidak ada opsi tersedia' : '')

    return (
        <Field
            component={({}) => (
                <VendorComponent
                    defaultValue={value}
                    disabled={isSubmitting || isOptionsEmpty}
                    fullWidth
                    noOptionsText="Tidak ada opsi"
                    onChange={(_, newValue) => {
                        setFieldValue(name, newValue)
                    }}
                    options={options}
                    renderInput={params => (
                        <TextField
                            {...params}
                            error={error}
                            helperText={helperText}
                            required={false}
                            {...slotProps?.textField}
                        />
                    )}
                    {...props}
                />
            )}
            name={name}
        />
    )
}

type AutocompleteProps<T extends TType, Multiple extends boolean> = Omit<
    VendorProps<T, Multiple, undefined, undefined>,
    'renderInput' | 'onChange'
> & {
    name: string

    placeholder?: string

    required?: boolean

    slotProps?: {
        textField?: TextFieldProps
    }
}
