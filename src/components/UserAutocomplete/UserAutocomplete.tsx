// types
import type { AutocompleteProps } from '@mui/material/Autocomplete'
import type { ChipTypeMap } from '@mui/material/Chip'
import type UserType from '@/dataTypes/User'
import type { ReactNode } from 'react'
// vendors
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
// materials
import MuiAutocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// components
import TextField from '@/components/TextField'
import useSWR from 'swr'
import RoleChips from '../User/RoleChips'
import ScrollableXBox from '../ScrollableXBox'
import { TextFieldProps } from '@mui/material'

function isSearchTermPassedTheRequirements(value: string) {
    return value.length >= 3 || (value.length >= 2 && value.startsWith('#'))
}

export default function UserAutocomplete<
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
>({
    label,
    showRole,
    noOptionsText = 'Pengguna tidak ditemukan',
    showNickname,
    error,
    helperText,
    textFieldProps = {},
    ...props
}: Omit<
    AutocompleteProps<
        UserType,
        Multiple,
        DisableClearable,
        false,
        ChipComponent
    > & {
        error?: boolean
        helperText?: ReactNode
        textFieldProps?: Omit<TextFieldProps, 'error' | 'helperText'>
    },
    'options' | 'renderInput' | 'freeSolo'
> & {
    label: string
    showRole?: boolean
    showNickname?: boolean
}) {
    const [inputValue, setInputValue] = useState('')

    const [debouncedInputValue] = useDebounce(inputValue, 500)

    const { data: options = [], isLoading } = useSWR<UserType[]>(
        debouncedInputValue &&
            isSearchTermPassedTheRequirements(debouncedInputValue)
            ? [
                  'users/search',
                  {
                      query: debouncedInputValue,
                  },
              ]
            : null,
        null,
    )
    return (
        <MuiAutocomplete
            options={options}
            isOptionEqualToValue={(option, value) =>
                option?.id === value?.id || option === value
            }
            getOptionLabel={option => `#${option.id} - ${option.name}`}
            noOptionsText={
                isSearchTermPassedTheRequirements(inputValue)
                    ? 'Ketik minimal 3 karakter'
                    : noOptionsText
            }
            loadingText={
                <>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                </>
            }
            filterOptions={x => x}
            loading={isLoading}
            onInputChange={(_, value) => setInputValue(value)}
            renderOption={(props, option) => (
                <li
                    {...props}
                    key={option.id}
                    style={{
                        display: 'block',
                    }}>
                    <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="caption" component="span">
                                {option.id}
                            </Typography>
                            <Typography component="span">
                                {option.name}
                            </Typography>
                        </Box>

                        {showNickname && option.nickname && (
                            <Typography variant="caption" component="div">
                                {option.nickname}
                            </Typography>
                        )}

                        {showRole && option.role_names_id.length > 0 && (
                            <ScrollableXBox>
                                <RoleChips
                                    data={option.role_names_id}
                                    size="small"
                                />
                            </ScrollableXBox>
                        )}
                    </Box>
                </li>
            )}
            renderInput={params => (
                <TextField
                    {...params}
                    autoComplete="off"
                    label={label}
                    name="user_uuid"
                    error={error}
                    helperText={helperText}
                    {...textFieldProps}
                />
            )}
            {...props}
        />
    )
}
