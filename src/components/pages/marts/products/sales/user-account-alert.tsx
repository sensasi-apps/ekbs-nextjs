import { Alert, Fade, Typography } from '@mui/material'
import blinkSxValue from '@/utils/blinkSxValue'
import { useState } from 'react'

export function UserAccountAlert() {
    const [showWarning, setShowWarning] = useState(true)

    return (
        <Fade in={showWarning} unmountOnExit>
            <Alert
                severity="warning"
                variant="outlined"
                onClose={() => setShowWarning(false)}
                sx={{
                    mx: 4,
                }}>
                <Typography
                    component="div"
                    variant="caption"
                    fontWeight="bold"
                    sx={blinkSxValue}>
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
