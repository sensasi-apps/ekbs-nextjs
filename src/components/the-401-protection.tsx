'use client'

// icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Alert from '@mui/material/Alert'
// materials
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
// vendors
import { useEffect, useState } from 'react'
// hooks
import useAuthInfoState from '@/hooks/use-auth-info-state'
import findLsKeyByValue from '@/utils/find-ls-key-by-value'

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
                alignItems: 'center',
                backgroundColor:
                    'rgba(0,0,0,0.5)' /* Black background with opacity */,
                bottom: 0,
                display: 'flex',
                height: '100%' /* Full height (cover the whole page) */,
                justifyContent: 'center',
                position: 'fixed' /* Sit on top of the page content */,
                right: 0,
                top: 0,
                width: '100%' /* Full width (cover the whole page) */,
                zIndex: 1201 /* 1200 is drawer z-index */,
            }}>
            <Alert
                action={
                    <Button
                        color="inherit"
                        endIcon={<ArrowForwardIcon />}
                        onClick={clearAuthOnLs}
                        size="small"
                        variant="outlined">
                        Proses
                    </Button>
                }
                severity="error"
                sx={{
                    px: 3,
                    py: 2,
                }}
                variant="filled">
                <AlertTitle>Sesi Anda telah berakhir</AlertTitle>
                Mohon untuk melakukan login kembali.
            </Alert>
        </div>
    )
}
