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
            variant="body1"
            component="h3"
            display="flex"
            alignItems="center"
            gap={2}
            {...rest}>
            {startIcon}
            {children}
        </Typography>
    )
}
