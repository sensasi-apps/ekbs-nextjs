import Typography, { TypographyProps } from '@mui/material/Typography'
import { ReactNode } from 'react'

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
