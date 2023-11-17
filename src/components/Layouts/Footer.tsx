import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
// etc
import packageJson from '@/../package.json'

export default function Footer() {
    return (
        <Box
            mt={8}
            mb={4}
            textAlign="center"
            color="GrayText"
            component="footer">
            <Typography variant="caption" component="div">
                Koperasi Belayan Sejahtera Elektronik
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
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    )
}
