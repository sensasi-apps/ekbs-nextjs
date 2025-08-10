import { useColorScheme } from '@mui/material/styles'

import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'

export default function DarkModeSwitch({
    disablePm = false,
}: {
    disablePm?: boolean
}) {
    const { mode, setMode } = useColorScheme()

    return (
        <MenuItem
            sx={{
                p: disablePm ? 0 : undefined,
            }}
            onClick={event => {
                event.preventDefault()

                return setMode(mode === 'dark' ? 'light' : 'dark')
            }}>
            <FormControlLabel
                label="Mode Gelap"
                sx={{
                    m: disablePm ? 0 : undefined,
                }}
                control={<Switch checked={mode === 'dark'} />}
            />
        </MenuItem>
    )
}
