import { useState } from 'react'
import axios from '@/lib/axios'
import useSWRMutation from 'swr/mutation'

import { Autocomplete as MuiAutocomplete } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export default function Autocomplete({
    endpoint,
    noOptionsText,
    label = 'Cari',
    required = false,
    margin = 'none',
    ...props
}) {
    const [searchText, setSearchText] = useState('')
    const [isSearched, setIsSearched] = useState(false)
    const [userOptions, setUserOptions] = useState([])

    const fetchUserOptions = async (searchUrl, { arg: { searchText } }) => {
        const { data } = await axios.get(`${searchUrl}?query=${searchText}`)
        return data
    }

    const { trigger, isMutating } = useSWRMutation(endpoint, fetchUserOptions, {
        revalidateOnFocus: false,
    })

    const handleKeyDown = async e => {
        if (e.key === 'Enter' && e.target.value.length >= 3 && !isMutating) {
            e.preventDefault()
            setIsSearched(true)
            const data = await trigger({ searchText: e.target.value })
            setUserOptions(data)
        }
    }

    const handleKeyUp = e => {
        setIsSearched(false)
        setSearchText(e.target.value)
    }

    const getNoOptionsText = () => {
        if (searchText.length < 3) return 'Ketik minimal 3 karakter'

        if (!isSearched) return 'Tekan Enter untuk mencari'

        return noOptionsText || 'Tidak ada data yang sesuai'
    }

    return (
        <MuiAutocomplete
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
                        {option.chip && (
                            <Chip size="small" label={option.chip} />
                        )}
                        <Typography ml={1}>{option.name}</Typography>
                    </Box>
                </li>
            )}
            renderInput={params => (
                <TextField
                    {...params}
                    label={label}
                    margin={margin}
                    required={required}
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
