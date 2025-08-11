'use client'

// vendors
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// materials
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
// icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export function The401Protection() {
    const { replace } = useRouter()
    const [isShow, setIsShow] = useState(false)

    useEffect(() => {
        function show() {
            setIsShow(true)
        }

        window.addEventListener('401Error', show, { passive: true })

        return () => {
            window.removeEventListener('401Error', show)
        }
    }, [])

    if (!isShow) return null

    return (
        <div
            style={{
                position: 'fixed' /* Sit on top of the page content */,
                width: '100%' /* Full width (cover the whole page) */,
                height: '100%' /* Full height (cover the whole page) */,
                top: 0,
                right: 0,
                bottom: 0,
                backgroundColor:
                    'rgba(0,0,0,0.5)' /* Black background with opacity */,
                zIndex: 1201 /* 1200 is drawer z-index */,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Alert
                severity="error"
                variant="filled"
                sx={{
                    py: 2,
                    px: 3,
                }}>
                <AlertTitle>Sesi Anda telah berakhir</AlertTitle>
                Mohon untuk lakukan Logout terlebih dahulu
                <Button
                    sx={{
                        ml: 4,
                    }}
                    color="inherit"
                    onClick={() => replace('/logout')}
                    endIcon={<ArrowForwardIcon />}>
                    LOGOUT
                </Button>
            </Alert>
        </div>
    )
}
