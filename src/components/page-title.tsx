import Typography from '@mui/material/Typography'

/**
 * A page title component.
 */
export default function PageTitle({
    title,
    subtitle,
}: {
    title: string
    subtitle?: string
}) {
    return (
        <>
            <Typography
                fontSize="2.5rem"
                component="h1"
                fontWeight="bold"
                lineHeight={1}>
                {title}
            </Typography>

            {subtitle && (
                <Typography
                    mt={0.75}
                    variant="subtitle2"
                    component="div"
                    color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </>
    )
}
