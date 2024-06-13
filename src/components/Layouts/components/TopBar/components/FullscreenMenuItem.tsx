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
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        setIsFullscreen(Boolean(document.fullscreenElement))
        setIsSupported(
            [
                'requestFullscreen',
                'webkitRequestFullScreen',
                'mozRequestFullScreen',
            ].some(method => method in document.documentElement),
        )
    }, [])

    if (!isSupported) return null

    const toggleFullscreen = () => {
        if (isFullscreen) {
            exitFullscreen()
        } else {
            requestFullscreen()
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

function requestFullscreen() {
    const docEl = document.documentElement

    const method = [
        // mozilla proposal and W3C Proposal
        'requestFullscreen',

        // Webkit (works in Safari and Chrome Canary)
        'webkitRequestFullScreen',

        // Firefox (works in nightly)
        'mozRequestFullScreen',
    ].find(method => method in docEl)

    if (method) {
        // @ts-expect-error method is in docEl
        docEl[method]()
    }
}

function exitFullscreen() {
    const method = [
        // mozilla proposal
        'exitFullscreen',

        // Webkit (works in Safari and Chrome Canary)
        'webkitExitFullscreen',

        // Firefox (works in nightly)
        'mozCancelFullScreen',

        // W3C Proposal
        'exitFullscreen',
    ].find(method => method in document)

    if (method) {
        // @ts-expect-error method is in docEl
        document[method]()
    }
}
