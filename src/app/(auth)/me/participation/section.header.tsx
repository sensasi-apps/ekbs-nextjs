// icons-materials
import ChevronRight from '@mui/icons-material/ChevronRight'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
//
import type { ReactNode } from 'react'

export default function SectionHeader({
    title,
    iconTitle,
    detailHref,
}: {
    title: string
    iconTitle: ReactNode
    detailHref?: string
}) {
    return (
        <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            py={1.5}
            sx={{
                bgcolor: 'background.default',
                position: 'sticky',
                top: {
                    sm: '4em',
                    xs: '3.5em',
                },
                zIndex: 1,
            }}>
            <Box alignItems="center" display="flex" gap={1}>
                {iconTitle}

                <Typography component="div" variant="h6">
                    {title}
                </Typography>
            </Box>

            {detailHref && (
                <Button
                    color="success"
                    component="a"
                    endIcon={<ChevronRight />}
                    href={detailHref}
                    size="small"
                    variant="outlined">
                    Rincian
                </Button>
            )}
        </Box>
    )
}
