'use client'

// materials
import Alert from '@mui/material/Alert'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
// vendors
import { useState } from 'react'
//
import blinkSxValue from '@/utils/blink-sx-value'

export function UserAccountAlert() {
    const [showWarning, setShowWarning] = useState(true)

    return (
        <Fade in={showWarning} unmountOnExit>
            <Alert
                onClose={() => setShowWarning(false)}
                severity="warning"
                sx={{
                    mx: 4,
                }}
                variant="outlined">
                <Typography
                    component="div"
                    fontWeight="bold"
                    sx={blinkSxValue}
                    variant="caption">
                    Peringatan
                </Typography>

                <Typography variant="caption">
                    Pastikan nama akun yang tertera telah sesuai dengan nama
                    Anda
                </Typography>
            </Alert>
        </Fade>
    )
}
