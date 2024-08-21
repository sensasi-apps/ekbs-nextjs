import { memo, useEffect, useState } from 'react'
// icons
import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField, TextFieldProps } from '@mui/material'

function SearchTextField({
    onChange,
    value: valueProp,
}: {
    onChange: TextFieldProps['onChange']
    value: string
}) {
    const [value, setValue] = useState<string>(valueProp)

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    return (
        <TextField
            placeholder="Nama / Kode / Kategori"
            name="product-search"
            margin="none"
            size="small"
            value={value}
            onChange={e => {
                setValue(e.target.value)
                onChange?.(e)
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default memo(SearchTextField)
