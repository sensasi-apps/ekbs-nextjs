import Typography, { type TypographyProps } from '@mui/material/Typography'
import { type ReactNode } from 'react'

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
            variant="h5"
            component="h2"
            display="flex"
            alignItems="center"
            gap={2}
            {...rest}>
            {startIcon}
            {children}
        </Typography>
    )
}
