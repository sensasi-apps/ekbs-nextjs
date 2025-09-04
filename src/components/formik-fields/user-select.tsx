// vendors
import {
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
} from 'react'
import { type FieldProps, Field } from 'formik'
import { type ListRowProps, List } from 'react-virtualized'
import useSWR from 'swr'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
//
import type User from '@/modules/auth/types/orms/user'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

/**
 * API response from `data/minimal-users`.
 */
type ApiResponse = {
    id: User['id']
    uuid: User['uuid']
    name: User['name']
    nickname: User['nickname']
}[]

export default function UserSelect({
    disabled,
    label,
    name,
    slotProps,
}: {
    disabled: boolean
    name: string
    label: string
    slotProps?: {
        textField?: TextFieldProps
    }
}) {
    const { data: users = [], isLoading } = useSWR<ApiResponse>(
        'data/minimal-users',
        null,
        {
            keepPreviousData: true,
        },
    )

    return (
        <Field name={name}>
            {({
                field: { value, name },
                form: { setFieldValue, isSubmitting },
                meta: { error },
            }: FieldProps<string>) => {
                const selectedUser = value
                    ? users.find(({ uuid }) => uuid === value)
                    : undefined

                return (
                    <Autocomplete
                        disableListWrap
                        getOptionLabel={({ name, id }) => `#${id} — ${name}`}
                        onChange={(_, value) => {
                            setFieldValue(name, value?.uuid)
                        }}
                        disabled={disabled || isSubmitting || isLoading}
                        value={selectedUser ?? null}
                        filterOptions={(options, { inputValue }) => {
                            if (!inputValue || inputValue.length <= 3) {
                                return []
                            }

                            return options.filter(option =>
                                option.name
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
                                {...errorsToHelperTextObj(error)}
                                {...slotProps?.textField}
                            />
                        )}
                    />
                )
            }}
        </Field>
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
