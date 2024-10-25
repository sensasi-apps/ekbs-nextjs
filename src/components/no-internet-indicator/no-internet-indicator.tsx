import blinkSxValue from '@/utils/blinkSxValue'
import { SignalWifiStatusbarConnectedNoInternet4 } from '@mui/icons-material'
import { Alert, Tooltip } from '@mui/material'
import { useIsOnline } from 'react-use-is-online'

/**
 * A component that displays an indicator when the device is not connected to the internet.
 * It uses a tooltip to show an error message and an icon to indicate the lack of internet connection.
 */
export function NoInternetIndicator() {
    const { isOnline } = useIsOnline()

    if (typeof window === 'undefined') return null
    if (isOnline) return null

    return (
        <Tooltip
            title={
                <Alert severity="error" variant="filled">
                    Perangkat anda sedang tidak terhubung ke internet, data yang
                    anda lihat mungkin tidak mutakhir.
                </Alert>
            }
            slotProps={{
                tooltip: {
                    sx: {
                        p: 0,
                    },
                },
            }}
            arrow
            placement="left">
            <SignalWifiStatusbarConnectedNoInternet4
                sx={{ ...blinkSxValue, fontSize: '2rem' }}
                color="error"
            />
        </Tooltip>
    )
}
