// vendors
import {
    type CSSProperties,
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
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
//
import type User from '@/modules/user/types/orms/user'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import ChipSmall from '../ChipSmall'
import FlexBox from '../flex-box'

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
    const [searchValue, setSearchValue] = useState('')
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
            getOptionLabel={selectedUser => JSON.stringify(selectedUser)}
            renderOption={renderOption}
            onChange={(_, value) => {
                setSearchValue(value?.name ?? '')
                setFieldValue(name, value?.uuid)
            }}
            noOptionsText={
                isSearchTermPassedTheRequirements(searchValue)
                    ? 'Pengguna tidak ditemukan'
                    : 'Ketik minimal 3 karakter'
            }
            disabled={
                disabled || isSubmitting || isLoading || status?.isDisabled
            }
            value={selectedUser ?? null}
            filterOptions={filterOptions}
            slotProps={{
                listbox: {
                    component: ListboxComponent,
                },
            }}
            options={users}
            loading={isLoading}
            loadingText="Sedang memuat..."
            renderInput={params => {
                return (
                    <TextField
                        {...params}
                        required
                        variant="outlined"
                        label={label}
                        size="small"
                        margin="dense"
                        fullWidth
                        component="div"
                        onChange={({ currentTarget: { value } }) => {
                            setSearchValue(value)
                        }}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: selectedUser ? (
                                <InputAdornment position="end">
                                    <ChipSmall label={selectedUser.id} />
                                </InputAdornment>
                            ) : undefined,
                        }}
                        inputProps={{
                            ...params.inputProps,
                            value:
                                selectedUser?.name ?? params.inputProps.value,
                        }}
                        {...errorsToHelperTextObj(error)}
                        {...slotProps?.textField}
                    />
                )
            }}
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
    const items = Children.toArray(children) as ReactElement<{
        style: CSSProperties
    }>[]
    const itemCount = items.length
    const itemSize = 40
    const listHeight = itemSize * itemCount

    return (
        <div ref={ref}>
            <Box
                {...other}
                sx={{
                    '.ReactVirtualized__Grid__innerScrollContainer': {
                        maxWidth: 'unset !important',
                    },
                }}>
                <List
                    height={Math.min(listHeight, 250)}
                    autoWidth
                    width={500}
                    rowHeight={itemSize}
                    overscanCount={5}
                    rowCount={itemCount}
                    rowRenderer={(listRowProps: ListRowProps) =>
                        isValidElement(items[listRowProps.index])
                            ? cloneElement(items[listRowProps.index], {
                                  style: listRowProps.style,
                              })
                            : null
                    }
                    role={role}
                />
            </Box>
        </div>
    )
})

function isSearchTermPassedTheRequirements(value: string) {
    return value.length >= 3 || (value.length >= 2 && value.startsWith('#'))
}

function filterOptions(
    options: ApiResponse,
    {
        inputValue,
    }: {
        inputValue: string
    },
) {
    if (!isSearchTermPassedTheRequirements(inputValue)) {
        return []
    }

    return options.filter(option =>
        inputValue.startsWith('#')
            ? `#${option.id}` === inputValue
            : option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
              option.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
    )
}

const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    { id, name, nickname }: ApiResponse[number],
) => (
    <Box
        {...props}
        component="li"
        width="100%"
        key={id}
        sx={{
            height: 'unset !important',
        }}>
        <FlexBox key={id}>
            <ChipSmall label={id} sx={{ mr: 1 }} />
            <div>
                <Typography component="div" lineHeight="1em" mb={0.1}>
                    {name}
                </Typography>

                {nickname && (
                    <Typography
                        variant="caption"
                        component="div"
                        color="textDisabled"
                        lineHeight="1em">
                        {nickname}
                    </Typography>
                )}
            </div>
        </FlexBox>
    </Box>
)
