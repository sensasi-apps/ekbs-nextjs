import ArrowForward from '@mui/icons-material/ArrowForward'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export function The401Protection({ hasMenu = false }: { hasMenu?: boolean }) {
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

    return (
        <Box
            sx={{
                position: 'absolute' /* Sit on top of the page content */,
                width: '100%' /* Full width (cover the whole page) */,
                height: '100%' /* Full height (cover the whole page) */,
                top: 0,
                left: hasMenu ? 120 : 0,
                right: 0,
                bottom: 0,
                bgcolor: 'red',
                backgroundColor:
                    'rgba(0,0,0,0.5)' /* Black background with opacity */,
                zIndex: 1,
                display: isShow ? 'flex' : 'none',
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
                Mohon untuk lakukan Logout terlebih dahulu
                <Button
                    sx={{
                        ml: 4,
                    }}
                    color="inherit"
                    onClick={() => replace('/logout')}
                    endIcon={<ArrowForward />}>
                    LOGOUT
                </Button>
            </Alert>
        </Box>
    )
}
