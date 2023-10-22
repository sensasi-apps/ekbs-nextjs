import { useColorScheme } from '@mui/material/styles'

import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'

export default function DarkModeSwitch() {
    const { mode, setMode } = useColorScheme()

    return (
        <MenuItem onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
            <FormControlLabel
                label="Mode Gelap"
                control={<Switch checked={mode === 'dark'} />}
            />
        </MenuItem>
    )
}
