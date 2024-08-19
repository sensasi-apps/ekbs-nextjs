import { memo } from 'react'
// icons
import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField, TextFieldProps } from '@mui/material'

function SearchTextField({
    onChange,
}: {
    onChange: TextFieldProps['onChange']
}) {
    return (
        <TextField
            placeholder="Nama / Kode / Kategori"
            name="product-search"
            margin="none"
            size="small"
            onChange={onChange}
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
