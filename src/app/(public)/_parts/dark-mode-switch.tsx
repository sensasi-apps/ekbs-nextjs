'use client'

import { useColorScheme } from '@mui/material/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

export default function DarkModeSwitchMenuItem() {
    const { mode, setMode } = useColorScheme()

    return (
        <FormControlLabel
            label="Mode Gelap"
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            control={<Switch checked={mode === 'dark'} />}
        />
    )
}
