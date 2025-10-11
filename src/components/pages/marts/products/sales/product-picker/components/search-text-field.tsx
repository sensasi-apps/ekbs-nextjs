// vendors

// icons
import Close from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
// materials
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { memo, useEffect, useState } from 'react'

function SearchTextField({
    value: valueProp,
    onValueChange,
}: {
    value: string
    onValueChange: (value: string) => void
}) {
    const [value, setValue] = useState<string>(valueProp)

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    return (
        <TextField
            autoComplete="off"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Fade in={Boolean(value)}>
                            <IconButton
                                onClick={() => {
                                    setValue('')
                                    onValueChange('')
                                }}
                                size="small">
                                <Close />
                            </IconButton>
                        </Fade>
                    </InputAdornment>
                ),
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="disabled" fontSize="small" />
                    </InputAdornment>
                ),
            }}
            margin="none"
            name="product-search"
            onChange={e => {
                setValue(e.target.value)
                onValueChange(e.target.value)
            }}
            placeholder="Nama / Kode / Kategori"
            size="small"
            value={value}
        />
    )
}

export default memo(SearchTextField)
