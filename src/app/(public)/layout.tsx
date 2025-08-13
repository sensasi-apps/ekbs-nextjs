// types
import type { ReactNode } from 'react'
//vendors
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
// components
import BackButton from '@/components/back-button'
// parts
import Footer from '@/components/Layouts/_parts/footer'
import DarkModeSwitch from '@/components/Layouts/_parts/TopBar/components/DarkModeSwitch'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Container
            maxWidth="md"
            sx={{
                p: 4,
            }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}>
                <BackButton />

                <DarkModeSwitch disablePm />
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                gap={16}
                justifyContent="space-between">
                <main>{children}</main>

                <Box color="grey.500">
                    <Footer />
                </Box>
            </Box>
        </Container>
    )
}
