import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import SectionHeader from './section.header'

export default function ComingSoonSection({
    title,
    iconTitle,
}: {
    title: string
    iconTitle: ReactNode
}) {
    return (
        <Box mb={3}>
            <SectionHeader iconTitle={iconTitle} title={title} />

            <Typography color="grey" mt={1} variant="body2">
                Akan hadir
            </Typography>
        </Box>
    )
}
