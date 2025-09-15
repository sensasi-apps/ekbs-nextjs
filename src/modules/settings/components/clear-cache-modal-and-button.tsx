'use client'

// vendors
import { useSWRConfig } from 'swr'
// icons
import CachedIcon from '@mui/icons-material/Cached'
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
            shouldConfirm
            onConfirm={handleClearCache}
            title="Konfirmasi Bersihkan Cache"
            buttonProps={{
                color: 'success',
                children: 'Bersihkan Cache',
                startIcon: <CachedIcon />,
                variant: 'outlined',
            }}>
            Apakah Anda yakin ingin membersihkan cache aplikasi?
        </ConfirmationDialogWithButton>
    )
}
