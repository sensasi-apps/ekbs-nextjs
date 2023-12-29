// vendors
import React, { memo } from 'react'
import { useColorScheme } from '@mui/material/styles'

// materials
import Box from '@mui/material/Box'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
// icons
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

const DarkModeToggle = memo(function DarkModeToggle() {
    const { mode, setMode } = useColorScheme()

    return (
        <Box>
            <Grow
                in={mode === 'light'}
                unmountOnExit
                timeout={{
                    enter: 500,
                    exit: 0,
                }}>
                <Tooltip title="Mode Gelap">
                    <IconButton
                        size="small"
                        onClick={event => {
                            event.preventDefault()

                            return setMode('dark')
                        }}>
                        <DarkModeIcon />
                    </IconButton>
                </Tooltip>
            </Grow>

            <Grow
                in={mode === 'dark'}
                timeout={{
                    enter: 500,
                    exit: 0,
                }}>
                <Tooltip title="Mode Terang">
                    <IconButton
                        size="small"
                        color="warning"
                        onClick={event => {
                            event.preventDefault()

                            return setMode('light')
                        }}>
                        <LightModeIcon />
                    </IconButton>
                </Tooltip>
            </Grow>
        </Box>
    )
})

export default DarkModeToggle
