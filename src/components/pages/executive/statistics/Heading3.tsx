import Typography, { type TypographyProps } from '@mui/material/Typography'
import { type ReactNode } from 'react'

export default function Heading3({
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
            component="h3"
            display="flex"
            gap={2}
            variant="body1"
            {...rest}>
            {startIcon}
            {children}
        </Typography>
    )
}
