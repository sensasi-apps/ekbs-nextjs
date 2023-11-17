import { useState, useEffect } from 'react'
// materials
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
// icons
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

export default function FullscreenMenuItem() {
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        setIsFullscreen(Boolean(document.fullscreenElement))
    }, [])

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
        setIsFullscreen(prev => !prev)
    }

    return (
        <MenuItem onClick={toggleFullscreen}>
            <ListItemIcon>
                {isFullscreen ? (
                    <FullscreenExitIcon fontSize="small" />
                ) : (
                    <FullscreenIcon fontSize="small" />
                )}
            </ListItemIcon>
            <ListItemText>{isFullscreen && 'Tutup '}Layar Penuh</ListItemText>

            <Typography variant="body2" color="text.secondary">
                F11
            </Typography>
        </MenuItem>
    )
}
