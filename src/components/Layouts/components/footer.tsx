import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import packageJson from '@/../package.json'
import { ReactNode } from 'react'

const versionDateDayjs = dayjs(packageJson.versionDate)

export function Footer() {
    return (
        <Box component="footer" columnGap={2} display="flex" flexWrap="wrap">
            {[
                process.env.NEXT_PUBLIC_APP_NAME,
                `v${packageJson.version} (${versionDateDayjs.format(' DD-MM-YYYY')})`,
                <>
                    <Link
                        color="inherit"
                        href={packageJson.author.url}
                        target="_blank">
                        {packageJson.author.name}
                    </Link>{' '}
                    &copy; {versionDateDayjs.format('YYYY')}
                </>,
            ].map((item, i) => (
                <Typo key={i}>{item}</Typo>
            ))}
        </Box>
    )
}

function Typo({ children }: { children: ReactNode }) {
    return (
        <Typography variant="caption" component="span">
            {children}
        </Typography>
    )
}
