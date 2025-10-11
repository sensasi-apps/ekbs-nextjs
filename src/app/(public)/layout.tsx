// types

//vendors
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import type { ReactNode } from 'react'
import FlatFooter from '@/app/_parts/flat-footer'
// components
import BackButton from '@/components/back-button'
// parts
import DarkModeSwitch from './_parts/dark-mode-switch'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Container
            maxWidth="md"
            sx={{
                p: 4,
            }}>
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                mb={4}>
                <BackButton />

                <DarkModeSwitch />
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                gap={16}
                justifyContent="space-between">
                <main>{children}</main>

                <Box color="grey.500">
                    <FlatFooter />
                </Box>
            </Box>
        </Container>
    )
}
