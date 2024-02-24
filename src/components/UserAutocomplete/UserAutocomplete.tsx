// types
import type { AutocompleteProps } from '@mui/material/Autocomplete'
import type { ChipTypeMap } from '@mui/material/Chip'
import type UserType from '@/dataTypes/User'
import type { ReactNode } from 'react'
// vendors
import { useState } from 'react'
// materials
import MuiAutocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// components
import TextField from '@/components/TextField'
import useSWR from 'swr'
import debounce from '@/utils/debounce'
import RoleChips from '../User/RoleChips'
import ScrollableXBox from '../ScrollableXBox'

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
    },
    'options' | 'renderInput' | 'freeSolo'
> & {
    label: string
    showRole?: boolean
    showNickname?: boolean
}) {
    const [inputValue, setInputValue] = useState('')

    const {
        data: options = [],
        isLoading,
        isValidating,
    } = useSWR<UserType[]>(
        inputValue && inputValue.length >= 3
            ? [
                  '/users/search',
                  {
                      query: inputValue,
                  },
              ]
            : null,
    )

    const loading = isValidating || isLoading

    return (
        <MuiAutocomplete
            options={options}
            isOptionEqualToValue={(option, value) =>
                option?.id === value?.id || option === value
            }
            getOptionLabel={option => `#${option.id} - ${option.name}`}
            noOptionsText={
                inputValue.length < 3
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
            loading={loading}
            onInputChange={(_, value) =>
                debounce(() => (value ? setInputValue(value) : null), 350)
            }
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
                />
            )}
            {...props}
        />
    )
}
