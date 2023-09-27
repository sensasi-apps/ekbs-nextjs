import { FC, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

const FormActions: FC<FormActionsProps> = ({
    submitting,
    deleting,
    disabled,
    onCancel,
    onDelete,
}) => {
    const [isOffline, setIsOffline] = useState(false)

    const handleOffline = () => {
        setIsOffline(true)
    }

    const handleOnline = () => {
        setIsOffline(false)
    }

    useEffect(() => {
        window.addEventListener('offline', handleOffline, false)
        window.addEventListener('online', handleOnline, false)

        return () => {
            window.removeEventListener('offline', handleOffline, false)
            window.removeEventListener('online', handleOnline, false)
        }
    }, [])

    return (
        <Box
            display="flex"
            justifyContent={onDelete ? 'space-between' : 'flex-end'}
            alignContent="end"
            mt={2}>
            {onDelete && (
                <LoadingButton
                    onClick={onDelete}
                    disabled={submitting || disabled || isOffline}
                    loading={deleting}
                    color="error">
                    Hapus
                </LoadingButton>
            )}

            <Box display="flex" gap={1}>
                <Button
                    disabled={submitting || deleting || disabled}
                    type="reset"
                    color="info"
                    onClick={onCancel}>
                    Batal
                </Button>

                <LoadingButton
                    type="submit"
                    disabled={deleting || disabled || isOffline}
                    loading={submitting}
                    variant={isOffline ? 'outlined' : 'contained'}
                    color="info">
                    Simpan
                </LoadingButton>
            </Box>
        </Box>
    )
}

export default FormActions

interface FormActionsProps {
    submitting?: boolean
    deleting?: boolean
    disabled?: boolean
    onCancel: () => void
    onDelete?: () => void
}
