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
            <Typography fontSize="2.5rem" component="h1" fontWeight="bold">
                {title}
            </Typography>

            {subtitle && (
                <Typography
                    variant="subtitle2"
                    component="div"
                    color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </>
    )
}
