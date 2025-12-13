'use client'

// icons
import CachedIcon from '@mui/icons-material/Cached'
// vendors
import { useSWRConfig } from 'swr'
// components
import ConfirmationDialogWithButton from '@/components/confirmation-dialog-with-button'

export default function ClearCacheModalAndButton() {
    const { cache } = useSWRConfig()

    const handleClearCache = () => {
        let length = (cache as Map<string, object>).size

        while (length > 0) {
            cache.delete(cache.keys().next().value)
            length--
        }

        location.reload()
    }

    return (
        <ConfirmationDialogWithButton
            buttonProps={{
                color: 'success',
                startIcon: <CachedIcon />,
                variant: 'outlined',
            }}
            buttonText="Bersihkan Cache"
            onConfirm={handleClearCache}
            shouldConfirm
            title="Konfirmasi Bersihkan Cache">
            Apakah Anda yakin ingin membersihkan cache aplikasi?
        </ConfirmationDialogWithButton>
    )
}
