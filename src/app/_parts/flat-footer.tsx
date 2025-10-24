// vendors

import type { UrlObject } from 'node:url'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
// etc
import packageJson from '@/../package.json'
// components
import Link from '@/components/link'

const versionDateDayjs = dayjs(packageJson.versionDate)

export default function FlatFooter() {
    return (
        <Box columnGap={2} component="footer" display="flex" flexWrap="wrap">
            {[
                process.env.NEXT_PUBLIC_APP_NAME,
                `v${packageJson.version} (${versionDateDayjs.format(' DD-MM-YYYY')})`,
                <>
                    <Link
                        color="inherit"
                        href={packageJson.author.url as unknown as UrlObject}
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
        <Typography component="span" variant="caption">
            {children}
        </Typography>
    )
}
