'use client'

// vendors
import { useEffect, useState } from 'react'
// materials
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
// icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import findLsKeyByValue from '@/utils/find-ls-key-by-value'
// hooks
import useAuthInfoState from '@/hooks/use-auth-info-state'

export default function The401Protection() {
    const [isShow, setIsShow] = useState(false)
    const [authInfo, setAuthInfo] = useAuthInfoState()

    useEffect(() => {
        function show() {
            setIsShow(true)
        }

        addEventListener('401Error', show, { passive: true })

        return () => {
            removeEventListener('401Error', show)
        }
    }, [])

    if (!isShow) return null

    function clearAuthOnLs() {
        findLsKeyByValue(JSON.stringify(authInfo)).map(key => {
            localStorage.removeItem(key)
        })

        setAuthInfo(undefined) // clear current auth info state
    }

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
                }}
                action={
                    <Button
                        color="inherit"
                        size="small"
                        variant="outlined"
                        onClick={clearAuthOnLs}
                        endIcon={<ArrowForwardIcon />}>
                        Proses
                    </Button>
                }>
                <AlertTitle>Sesi Anda telah berakhir</AlertTitle>
                Mohon untuk melakukan login kembali.
            </Alert>
        </div>
    )
}
