// vendors
import { type FieldProps, Field } from 'formik'
import useSWR from 'swr'
// materials
import type { TextFieldProps } from '@mui/material/TextField'
// components
import UserAutocomplete from '@/components/user-autocomplete'
//
import type MinimalUser from '@/modules/user/types/minimal-user'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

interface UserSelectProps {
    disabled?: boolean
    name: string
    label: string
    slotProps?: {
        textField?: TextFieldProps
    }
}

export default function UserSelect({
    disabled,
    label,
    name,
    slotProps,
}: UserSelectProps) {
    return (
        <Field
            name={name}
            component={InnerComponent}
            disabled={disabled}
            label={label}
            slotProps={slotProps}
        />
    )
}

function InnerComponent({
    disabled,
    label,
    slotProps,

    field: { name },
    form: { setFieldValue, isSubmitting, status, getFieldMeta },
}: Omit<FieldProps<string>, 'meta'> & Omit<UserSelectProps, 'name'>) {
    const { error: errorMeta, value } = getFieldMeta<string>(name)
    const { data: users = [], isLoading } = useSWR<MinimalUser[]>(
        'data/minimal-users',
        null,
        {
            dedupingInterval: 60 * 60 * 1000, // 1 hour
        },
    )

    const error = ['{}', '[]'].includes(JSON.stringify(errorMeta))
        ? undefined
        : errorMeta

    const selectedUser = value ? users.find(({ uuid }) => uuid === value) : null

    return (
        <UserAutocomplete
            disabled={
                disabled || isSubmitting || isLoading || status?.isDisabled
            }
            label={label}
            onChange={(_, value) => {
                setFieldValue(name, value?.uuid)
            }}
            slotProps={{
                ...slotProps,
                textField: {
                    ...errorsToHelperTextObj(error),
                    ...slotProps?.textField,
                },
            }}
            value={selectedUser}
        />
    )
}
