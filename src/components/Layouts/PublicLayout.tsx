// types
import type { ReactNode } from 'react'
//vendors
import Box from '@mui/material/Box'
import Container, { type ContainerProps } from '@mui/material/Container'
import Head from 'next/head'
// components
import BackButton from '../BackButton'
// parts
import Footer from './_parts/footer'
import DarkModeSwitch from './_parts/TopBar/components/DarkModeSwitch'

export default function PublicLayout({
    children,
    title,
    maxWidth = 'md',
}: {
    title: string
    children: ReactNode
    maxWidth?: ContainerProps['maxWidth']
}) {
    return (
        <Container
            maxWidth={maxWidth}
            sx={{
                // py: 3,
                p: 4,
            }}>
            <Head>
                <title>{title}</title>
            </Head>

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
