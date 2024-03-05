// types
import type UserType from '@/dataTypes/User'
import type ValidationErrorsType from '@/types/ValidationErrors'
import type { AutocompleteProps } from '@mui/material/Autocomplete'
import type { ChipTypeMap } from '@mui/material/Chip'
import type { TextFieldProps } from '@mui/material/TextField'
// vendors
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import axios from '@/lib/axios'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField' // TODO: replace with components/TextField
import Typography from '@mui/material/Typography'
// icons
import SearchIcon from '@mui/icons-material/Search'
// components
import RoleChips from '@/components/User/RoleChips'

type UserAutocompleteType<
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
    ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
> = (
    props: {
        textFieldProps?: Omit<
            TextFieldProps,
            | 'onChange'
            | 'onKeyDown'
            | 'onBlur'
            | 'InputLabelProps'
            | 'InputProps'
            | 'disabled'
            | 'fullWidth'
            | 'id'
            | 'inputProps'
            | 'size'
        >
    } & Omit<
        AutocompleteProps<
            UserType,
            Multiple,
            DisableClearable,
            FreeSolo,
            ChipComponent
        >,
        'renderInput' | 'options'
    >,
) => JSX.Element

const UserAutocomplete: UserAutocompleteType = ({
    textFieldProps,
    ...props
}) => {
    const [searchText, setSearchText] = useState('')
    const [isSearched, setIsSearched] = useState(false)
    const [userOptions, setUserOptions] = useState<UserType[]>([])
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrorsType>()

    const { trigger, isMutating } = useSWRMutation(
        `/users/search`,
        (url, { arg: searchText }: { arg: string }) =>
            axios
                .get(`${url}?query=${searchText}`)
                .then(res => res.data)
                .catch(error => {
                    if (error?.response?.status === 422) {
                        return setValidationErrors(error.response.data.errors)
                    }

                    throw error
                }),
        {
            revalidate: false,
        },
    )

    const handleSearch = async () => {
        if (searchText.length >= 3 && !isMutating && !isSearched) {
            const data = await trigger(searchText)
            setUserOptions(data)
            setIsSearched(true)
        }
    }

    const getNoOptionsText = () => {
        if (searchText.length < 3) return 'Ketik minimal 3 karakter'

        if (!isSearched) return 'Tekan Enter/Klik Ikon untuk mencari'

        return 'Pengguna tidak ditemukan'
    }

    return (
        <Autocomplete
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            options={userOptions}
            getOptionLabel={option => {
                if (!option) return ''

                return `#${option.id} ${option.name}`
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    {...textFieldProps}
                    onChange={event => {
                        setIsSearched(false)
                        setSearchText(event.target.value)
                    }}
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            event.preventDefault()

                            return handleSearch()
                        }
                    }}
                    onBlur={() => setSearchText('')}
                    error={
                        textFieldProps?.error ??
                        Boolean(validationErrors?.query)
                    }
                    helperText={
                        textFieldProps?.helperText ?? validationErrors?.query
                    }
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isMutating && (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                )}

                                {!isMutating &&
                                    // @ts-ignore
                                    !params.InputProps.endAdornment?.props
                                        .children[0] && (
                                        <IconButton
                                            sx={{
                                                p: 0,
                                            }}
                                            disabled={
                                                searchText.length < 3 ||
                                                isSearched
                                            }
                                            onClick={handleSearch}>
                                            <SearchIcon />
                                        </IconButton>
                                    )}

                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            onChange={props.onChange}
            noOptionsText={getNoOptionsText()}
            loadingText="Memuat..."
            filterOptions={x => x}
            loading={isMutating}
            renderOption={(props, user) => {
                return (
                    <li
                        {...props}
                        style={{
                            display: 'block',
                            alignItems: 'center',
                        }}>
                        <Box display="flex" gap={1} alignItems="center">
                            <Typography variant="caption">{user.id}</Typography>

                            <Typography>{user.name}</Typography>
                        </Box>

                        {user.nickname && (
                            <Typography variant="caption" component="div">
                                {user.nickname}
                            </Typography>
                        )}

                        {user.role_names_id.length > 0 && (
                            <Box overflow="auto">
                                <RoleChips
                                    data={user.role_names_id}
                                    size="small"
                                />
                            </Box>
                        )}
                    </li>
                )
            }}
            {...props}
        />
    )
}

export default UserAutocomplete
