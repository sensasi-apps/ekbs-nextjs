'use client'

import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import {
    closeSnackbar,
    SnackbarProvider as VendorSnackbarProvider,
} from 'notistack'

export default function SnackbarProvider() {
    return (
        <VendorSnackbarProvider
            action={key => (
                <IconButton onClick={() => closeSnackbar(key)} size="small">
                    <CloseIcon />
                </IconButton>
            )}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'top',
            }}
            maxSnack={7}
            style={{
                maxWidth: 350,
            }}
        />
    )
}
