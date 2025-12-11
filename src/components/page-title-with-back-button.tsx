import Box from '@mui/material/Box'
import type { Route } from 'next'
import BackButtonV2 from './back-button-v2'
import PageTitle from './page-title'

/**
 * A page title component.
 */
export default function PageTitleWithBackButton({
    backHref,
    title,
    subtitle,
}: {
    backHref?: Route
    title: string
    subtitle?: string
}) {
    return (
        <Box alignItems="top" display="flex" gap={2}>
            <div>
                <BackButtonV2 href={backHref} />
            </div>

            <div>
                <PageTitle subtitle={subtitle} title={title} />
            </div>
        </Box>
    )
}
