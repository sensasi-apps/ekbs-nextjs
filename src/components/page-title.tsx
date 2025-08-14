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
                fontWeight="500"
                lineHeight={1}
                mb={6}>
                {title}
            </Typography>

            {subtitle && (
                <Typography
                    mt={-5.5}
                    mb={6}
                    variant="subtitle2"
                    component="div"
                    fontWeight="100"
                    color="textDisabled">
                    {subtitle}
                </Typography>
            )}
        </>
    )
}
