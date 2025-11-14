// types

// material-ui
import MuiAutocomplete, {
    type AutocompleteProps as MuiAutocompletePropsTemp,
} from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import type { TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// vendors
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
// components
import TextField from '@/components/text-field'
import axios from '@/lib/axios'

// biome-ignore lint/suspicious/noExplicitAny: TODO: any will be remove
type MuiAutocompleteProps = MuiAutocompletePropsTemp<any, false, false, false>
type AutocompleteProps = Omit<MuiAutocompleteProps, 'options' | 'renderInput'>

export default function Autocomplete({
    endpoint,
    noOptionsText,
    label = 'Cari',
    required,
    margin = 'dense',
    ...props
}: {
    endpoint: string
    label?: TextFieldProps['label']
    required?: TextFieldProps['required']
    margin?: TextFieldProps['margin']
} & AutocompleteProps) {
    const [searchText, setSearchText] = useState('')
    const [isSearched, setIsSearched] = useState(false)
    // biome-ignore lint/suspicious/noExplicitAny: TODO: any will be remove
    const [options, setOptions] = useState<any[]>([])

    const fetchUserOptions = async (
        searchUrl: string,
        {
            arg: { searchText },
        }: {
            arg: { searchText: string }
        },
    ) => {
        const { data } = await axios.get(`${searchUrl}?query=${searchText}`)
        return data
    }

    const { trigger, isMutating } = useSWRMutation(endpoint, fetchUserOptions, {
        revalidate: false,
    })

    const handleKeyDown: MuiAutocompleteProps['onKeyDown'] = async event => {
        if (event.key === 'Enter' && !isMutating) {
            const value = (
                'value' in event.target ? event.target.value : ''
            ) as string

            if (value.length >= 3) {
                event.preventDefault()
                setIsSearched(true)
                const data = await trigger({ searchText: value })
                setOptions(data)
            }
        }
    }

    const handleKeyUp: MuiAutocompleteProps['onKeyUp'] = event => {
        setIsSearched(false)
        const value = (
            'value' in event.target ? event.target.value : ''
        ) as string
        setSearchText(value)
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
            filterOptions={x => x}
            getOptionLabel={option => `#${option.id} - ${option.name}`}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            loading={isMutating}
            loadingText="Memuat..."
            noOptionsText={getNoOptionsText()}
            onChange={props.onChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            options={options}
            renderInput={params => (
                <TextField
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
                    label={label}
                    margin={margin}
                    required={required}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    <Box alignItems="center" display="flex">
                        <Typography mr={1} variant="caption">
                            {option.id}
                        </Typography>
                        {option.chip && (
                            <Chip label={option.chip} size="small" />
                        )}
                        <Typography ml={1}>{option.name}</Typography>
                    </Box>
                </li>
            )}
            {...props}
        />
    )
}
