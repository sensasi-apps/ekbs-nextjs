import PropTypes from 'prop-types'

import { useState } from 'react'

import useSWRMutation from 'swr/mutation'

import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import axios from '@/lib/axios'
import RoleChips from './RoleChips'

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

    const fetchUserOptions = async (searchUrl, { arg: { searchText } }) => {
        const { data } = await axios.get(`${searchUrl}?query=${searchText}`)
        return data
    }

    const { trigger, isMutating } = useSWRMutation(
        `/users/search`,
        fetchUserOptions,
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
        },
    )

    const handleKeyDown = async e => {
        if (e.key === 'Enter' && e.target.value.length >= 3 && !isMutating) {
            e.preventDefault()
            setIsSearched(true)
            const data = await trigger({ searchText: e.target.value })
            setUserOptions(data)
        }
    }

    const handleKeyUp = e => {
        if (e.key === 'Enter') return

        setIsSearched(false)
        setSearchText(e.target.value)
    }

    const getNoOptionsText = () => {
        if (searchText.length < 3) return 'Ketik minimal 3 karakter'

        if (!isSearched) return 'Tekan Enter untuk mencari'

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
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
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
