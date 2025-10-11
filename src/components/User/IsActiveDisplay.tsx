// materials
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Switch from '@mui/material/Switch'

export default function IsActiveDisplay({ isActive = false }) {
    return (
        <FormControl disabled fullWidth margin="none">
            <FormLabel>Status Akun</FormLabel>
            <FormControlLabel
                control={
                    <Switch
                        checked={isActive}
                        color="success"
                        name="is_active"
                    />
                }
                label={isActive ? 'Aktif' : 'Nonaktif'}
                sx={{
                    color: isActive ? 'success.light' : 'text.secondary',
                }}
            />
        </FormControl>
    )
}
