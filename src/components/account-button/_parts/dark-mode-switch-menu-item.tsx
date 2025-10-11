'use client'

import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import { useColorScheme } from '@mui/material/styles'

export default function DarkModeSwitchMenuItem() {
    const { mode, setMode } = useColorScheme()

    return (
        <MenuItem
            onClick={event => {
                event.preventDefault()

                return setMode(mode === 'dark' ? 'light' : 'dark')
            }}>
            <FormControlLabel
                control={<Switch checked={mode === 'dark'} />}
                label="Mode Gelap"
            />
        </MenuItem>
    )
}
