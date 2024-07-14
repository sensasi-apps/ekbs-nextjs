// materials
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Switch from '@mui/material/Switch'

export default function IsActiveDisplay({ isActive = false }) {
    return (
        <FormControl fullWidth margin="normal" disabled>
            <FormLabel>Status Akun</FormLabel>
            <FormControlLabel
                sx={{
                    color: isActive ? 'success.light' : 'text.secondary',
                }}
                label={isActive ? 'Aktif' : 'Nonaktif'}
                control={
                    <Switch
                        color="success"
                        name="is_active"
                        checked={isActive}
                    />
                }
            />
        </FormControl>
    )
}
