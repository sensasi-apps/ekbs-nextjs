'use client'

// vendors
import { useState } from 'react'
// materials
import Button from '@mui/material/Button'
// icons
import CachedIcon from '@mui/icons-material/Cached'
// components
import ConfirmationDialog from '@/components/ConfirmationDialog'
import { useSWRConfig } from 'swr'

export default function ClearCacheModalAndButton() {
    const { cache } = useSWRConfig()

    const [open, setOpen] = useState(false)

    const handleClearCache = () => {
        let length = (cache as Map<string, object>).size

        while (length > 0) {
            cache.delete(cache.keys().next().value)
            length--
        }

        location.reload()
    }

    return (
        <>
            <Button
                variant="outlined"
                color="success"
                startIcon={<CachedIcon />}
                onClick={() => setOpen(true)}>
                Bersihkan Cache
            </Button>

            <ConfirmationDialog
                open={open}
                onCancel={() => setOpen(false)}
                onConfirm={handleClearCache}
                title="Konfirmasi Bersihkan Cache"
                content="Apakah Anda yakin ingin membersihkan cache aplikasi?"
            />
        </>
    )
}
