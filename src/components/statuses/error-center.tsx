import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

import Box, { type BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function ErrorCenter({
    message,
    isShow = true,
    onClose,
    children,
    ...props
}: {
    message?: string
    isShow?: boolean
    onClose?: () => void
} & BoxProps) {
    return (
        <Box
            display={isShow ? 'block' : 'none'}
            my={4}
            textAlign="center"
            {...props}>
            <Typography>
                <ErrorOutlineIcon color="error" sx={{ fontSize: '8rem' }} />
            </Typography>

            <Typography variant="overline">
                {message || children || 'Terjadi kesalahan.'}
            </Typography>

            {onClose && (
                <Box mt={6}>
                    <Button color="error" onClick={onClose} variant="contained">
                        Kembali
                    </Button>
                </Box>
            )}
        </Box>
    )
}
