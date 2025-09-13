// vendors
import {
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useState,
} from 'react'
import { type FieldProps, Field } from 'formik'
import { type ListRowProps, List } from 'react-virtualized'
import useSWR from 'swr'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
//
import type User from '@/modules/user/types/orms/user'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import ChipSmall from '../ChipSmall'

/**
 * API response from `data/minimal-users`.
 */
type ApiResponse = {
    id: User['id']
    uuid: User['uuid']
    name: User['name']
    nickname: User['nickname']
}[]

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
    const [textfieldValue, setTextFieldValue] = useState('')
    const { data: users = [], isLoading } = useSWR<ApiResponse>(
        'data/minimal-users',
        null,
        {
            keepPreviousData: true,
        },
    )

    const error = ['{}', '[]'].includes(JSON.stringify(errorMeta))
        ? undefined
        : errorMeta

    const selectedUser = value
        ? users.find(({ uuid }) => uuid === value)
        : undefined

    return (
        <Autocomplete
            disableListWrap
            getOptionLabel={({ id, name }) => `(${id}) ${name}`}
            renderOption={(li, { id, name }) => (
                <li {...li} key={id}>
                    <ChipSmall label={id} key={id} sx={{ mr: 1 }} />
                    {name}
                </li>
            )}
            onChange={(_, value) => {
                setFieldValue(name, value?.uuid)
            }}
            noOptionsText={
                isSearchTermPassedTheRequirements(textfieldValue)
                    ? 'Pengguna tidak ditemukan'
                    : 'Ketik minimal 3 karakter'
            }
            disabled={
                disabled || isSubmitting || isLoading || status?.isDisabled
            }
            value={selectedUser ?? null}
            filterOptions={(options, { inputValue }) => {
                if (!isSearchTermPassedTheRequirements(inputValue)) {
                    return []
                }

                return options.filter(option =>
                    inputValue.startsWith('#')
                        ? `#${option.id}` === inputValue
                        : option.name
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()),
                )
            }}
            slotProps={{
                listbox: {
                    component: ListboxComponent,
                },
            }}
            options={users}
            renderInput={params => (
                <TextField
                    {...params}
                    required
                    variant="outlined"
                    label={label}
                    size="small"
                    margin="dense"
                    fullWidth
                    onChange={({ currentTarget: { value } }) => {
                        setTextFieldValue(value)
                    }}
                    {...errorsToHelperTextObj(error)}
                    {...slotProps?.textField}
                />
            )}
        />
    )
}

const ListboxComponent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLElement> & {
        children: ReactNode
        role: string
    }
>(function ListboxComponent(props, ref) {
    const { children, role, ...other } = props
    const items = Children.toArray(children) as ReactElement[]
    const itemCount = items.length
    const itemSize = 40
    const listHeight = itemSize * itemCount

    return (
        <div ref={ref}>
            <div {...other}>
                <List
                    height={Math.min(listHeight, 250)}
                    autoWidth
                    width={500}
                    rowHeight={itemSize}
                    overscanCount={5}
                    rowCount={itemCount}
                    rowRenderer={(listRowProps: ListRowProps) => {
                        if (isValidElement(items[listRowProps.index])) {
                            return cloneElement(items[listRowProps.index], {
                                // @ts-expect-error  TODO: will fix see https://mui.com/material-ui/react-autocomplete/#virtualization
                                style: listRowProps.style,
                            })
                        }

                        return null
                    }}
                    role={role}
                />
            </div>
        </div>
    )
})

function isSearchTermPassedTheRequirements(value: string) {
    return value.length >= 3 || (value.length >= 2 && value.startsWith('#'))
}
