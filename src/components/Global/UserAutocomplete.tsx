import type UserType from '@/dataTypes/User'

import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import axios from '@/lib/axios'

import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { ChipTypeMap } from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import SearchIcon from '@mui/icons-material/Search'
import RoleChips from '@/components/User/RoleChips'
import ValidationErrorsType from '@/types/ValidationErrors'

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

        if (!navigator.onLine)
            return 'Anda sedang offline, data pengguna tidak dapat dijangkau'

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
                    error={Boolean(validationErrors?.query)}
                    helperText={validationErrors?.query}
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
            renderOption={(props, user) => (
                <li {...props} key={user.id}>
                    <Box display="flex" alignItems="center">
                        <Typography mr={1} variant="caption">
                            {user.id}
                        </Typography>
                        <Typography mr={2}>{user.name}</Typography>

                        <RoleChips data={user.role_names_id} size="small" />
                    </Box>
                </li>
            )}
            {...props}
        />
    )
}

export default UserAutocomplete
