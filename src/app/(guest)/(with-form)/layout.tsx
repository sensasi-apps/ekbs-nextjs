// vendors
import type { ReactNode } from 'react'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
// modules
import GuestBackButton from '@/app/(guest)/(with-form)/_parts/back-button'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Box
            display="flex"
            width="100%"
            sx={{
                justifyContent: {
                    sm: 'end',
                    md: 'space-between',
                },
            }}>
            <GuestBackButton />

            <Card
                sx={{
                    maxWidth: '460px',
                    borderRadius: 8,
                    backgroundColor:
                        'hsl(from var(--mui-palette-AppBar-darkBg) h s l / 60%)',
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
