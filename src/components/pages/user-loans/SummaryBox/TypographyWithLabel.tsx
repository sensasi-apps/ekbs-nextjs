import Typography, { TypographyProps } from '@mui/material/Typography'

export default function TypographyWithLabel({
    label,
    labelProps,
    ...props
}: {
    label: string
    labelProps?: TypographyProps
} & TypographyProps) {
    return (
        <div>
            <Typography color="GrayText" {...labelProps}>
                {label}
            </Typography>
            <Typography {...props} />
        </div>
    )
}
