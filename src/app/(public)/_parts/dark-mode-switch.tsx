'use client'

import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useColorScheme } from '@mui/material/styles'

export default function DarkModeSwitchMenuItem() {
    const { mode, setMode } = useColorScheme()

    return (
        <FormControlLabel
            control={<Switch checked={mode === 'dark'} />}
            label="Mode Gelap"
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        />
    )
}
