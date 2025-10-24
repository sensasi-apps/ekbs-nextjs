import Typography, { type TypographyProps } from '@mui/material/Typography'
import type { ReactNode } from 'react'

export default function Heading2({
    children,
    startIcon,
    ...rest
}: {
    children: ReactNode
    startIcon: ReactNode
} & TypographyProps) {
    return (
        <Typography
            alignItems="center"
            component="h2"
            display="flex"
            gap={2}
            variant="h5"
            {...rest}>
            {startIcon}
            {children}
        </Typography>
    )
}
