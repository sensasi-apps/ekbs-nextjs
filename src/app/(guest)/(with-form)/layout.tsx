// vendors

// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import type { ReactNode } from 'react'
// modules
import GuestBackButton from '@/app/(guest)/(with-form)/_parts/back-button'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Box
            display="flex"
            sx={{
                justifyContent: {
                    md: 'space-between',
                    sm: 'end',
                },
            }}
            width="100%">
            <GuestBackButton />

            <Card
                sx={{
                    backgroundColor:
                        'hsl(from var(--mui-palette-AppBar-darkBg) h s l / 60%)',
                    borderRadius: 8,
                    maxWidth: '460px',
                }}>
                <CardContent
                    sx={{
                        p: 3,
                    }}>
                    {children}
                </CardContent>
            </Card>
        </Box>
    )
}
