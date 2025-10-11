// types
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// vendors
import dayjs from 'dayjs'
// etc
import packageJson from '@/../package.json'
// components
import Link from '@/components/link'

/**
 * Renders the footer component for the application.
 *
 * @default
 * - mt: 8
 * - mb: 4
 * - textAlign: center
 * - color: GrayText
 * - component: footer
 */
export default function FooterBox(props: BoxProps) {
    return (
        <Box
            color="GrayText"
            component="footer"
            mb={4}
            mt={8}
            textAlign="center"
            {...props}>
            <Typography component="div" variant="caption">
                {process.env.NEXT_PUBLIC_APP_NAME}
            </Typography>
            <Typography component="div" variant="caption">
                v{packageJson.version} &mdash;
                {dayjs(packageJson.versionDate).format(' DD-MM-YYYY')}
            </Typography>
            <Typography component="div" variant="caption">
                <Link
                    color="inherit"
                    href="https://github.com/sensasi-apps"
                    target="_blank">
                    Sensasi Apps
                </Link>
                {' © '}
                {dayjs().format('YYYY')}
                {'.'}
            </Typography>
        </Box>
    )
}
