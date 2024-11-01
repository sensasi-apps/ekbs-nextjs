import { memo, useEffect, useState } from 'react'
// icons
import SearchIcon from '@mui/icons-material/Search'
import { Fade, IconButton, InputAdornment, TextField } from '@mui/material'
import { Close } from '@mui/icons-material'

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
            placeholder="Nama / Kode / Kategori"
            autoComplete="off"
            name="product-search"
            margin="none"
            size="small"
            value={value}
            onChange={e => {
                setValue(e.target.value)
                onValueChange(e.target.value)
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <Fade in={Boolean(value)}>
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setValue('')
                                    onValueChange('')
                                }}>
                                <Close />
                            </IconButton>
                        </Fade>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default memo(SearchTextField)
