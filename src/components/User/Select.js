import PropTypes from 'prop-types'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import axios from '@/lib/axios'

import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import SearchIcon from '@mui/icons-material/Search'

import RoleChips from './RoleChips'

const fetchUserOptions = (searchUrl, { arg: searchText }) =>
    axios.get(`${searchUrl}?query=${searchText}`).then(res => res.data)

const UserSelect = ({
    error,
    helperText,
    label = 'Cari Pengguna',
    margin = 'none',
    required,
    ...props
}) => {
    const [searchText, setSearchText] = useState('')
    const [isSearched, setIsSearched] = useState(false)
    const [userOptions, setUserOptions] = useState([])

    const { trigger, isMutating } = useSWRMutation(
        `/users/search`,
        fetchUserOptions,
        {
            revalidate: false,
        },
    )

    const handleSearch = async () => {
        if (searchText.length >= 3 && !isMutating) {
            const data = await trigger(searchText)
            setUserOptions(data)
            setIsSearched(true)
        }
    }

    const handleTextFieldKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault()

            return handleSearch()
        }
    }

    const handleTextFieldChange = e => {
        setIsSearched(false)
        setSearchText(e.target.value)
    }

    const getNoOptionsText = () => {
        if (searchText.length < 3) return 'Ketik minimal 3 karakter'

        if (!isSearched) return 'Tekan Enter/Klik Ikon untuk mencari'

        return 'Pengguna tidak ditemukan'
    }

    return (
        <Autocomplete
            componentsProps={{
                paper: {
                    elevation: 8,
                },
            }}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            options={userOptions}
            getOptionLabel={user => `#${user.id} - ${user.name}`}
            onChange={props.onChange}
            noOptionsText={getNoOptionsText()}
            loadingText="Memuat..."
            filterOptions={x => x}
            loading={isMutating}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    <Box display="flex" alignItems="center">
                        <Typography mr={1} variant="caption">
                            {option.id}
                        </Typography>
                        <Typography mr={2}>{option.name}</Typography>

                        <RoleChips data={option.role_names_id} size="small" />
                    </Box>
                </li>
            )}
            renderInput={params => (
                <TextField
                    margin={margin}
                    error={error}
                    helperText={helperText}
                    label={label}
                    required={required}
                    {...params}
                    onChange={handleTextFieldChange}
                    onKeyDown={handleTextFieldKeyDown}
                    onBlur={() => setSearchText('')}
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
                                    !params.InputProps.endAdornment.props
                                        .children[0] && (
                                        <IconButton
                                            sx={{
                                                p: 0,
                                            }}
                                            disabled={searchText.length < 3}
                                            onClick={() => {
                                                handleSearch(searchText)
                                            }}>
                                            <SearchIcon />
                                        </IconButton>
                                    )}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            {...props}
        />
    )
}

UserSelect.propTypes = {
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
    margin: PropTypes.string,
    required: PropTypes.bool,
}

export default UserSelect
