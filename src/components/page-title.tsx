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
                component="h1"
                fontSize="2.5rem"
                fontWeight="500"
                lineHeight={1}
                mb={6}>
                {title}
            </Typography>

            {subtitle && (
                <Typography
                    color="textDisabled"
                    component="div"
                    fontWeight="100"
                    mb={6}
                    mt={-5.5}
                    variant="subtitle2">
                    {subtitle}
                </Typography>
            )}
        </>
    )
}
