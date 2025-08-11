'use client'

import {
    SnackbarProvider as VendorSnackbarProvider,
    closeSnackbar,
} from 'notistack'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export default function SnackbarProvider() {
    return (
        <VendorSnackbarProvider
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            action={key => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                    <CloseIcon />
                </IconButton>
            )}
            maxSnack={7}
        />
    )
}
