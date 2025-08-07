// types
import type { BoxProps } from '@mui/material/Box'
// vendors
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
// etc
import packageJson from '@/../package.json'

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
            mt={8}
            mb={4}
            textAlign="center"
            color="GrayText"
            component="footer"
            {...props}>
            <Typography variant="caption" component="div">
                {process.env.NEXT_PUBLIC_APP_NAME}
            </Typography>
            <Typography variant="caption" component="div">
                v{packageJson.version} &mdash;
                {dayjs(packageJson.versionDate).format(' DD-MM-YYYY')}
            </Typography>
            <Typography variant="caption" component="div">
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
