import { FormControl, FormControlLabel, FormLabel, Switch } from '@mui/material'

export default function IsActiveDisplay({ isActive = false, ...props }) {
    return (
        <FormControl fullWidth margin="normal" disabled {...props}>
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
